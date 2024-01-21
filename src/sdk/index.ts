import { TfheCompactPublicKey } from "node-tfhe";
import { isAddress, fromHexString } from "./utils";
import {
  ContractPermits,
  determineRequestMethod,
  InstanceParams,
  SupportedProvider,
  EncryptionTypes,
} from "./types";
import { AbiCoder, Interface, JsonRpcProvider } from "ethers";

import { FheOpsAddress, MAX_UINT16, MAX_UINT32, MAX_UINT8 } from "./consts";
import { Permit, Permission } from "../extensions/access_control";
import { ValidateUintInRange } from "./utils";
import * as tfheEncrypt from "./encrypt";
import { isNumber, isPlainObject, isString } from "./validation";

/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
export class FhenixClient {
  private permits: ContractPermits = {};
  public fhePublicKey: Promise<TfheCompactPublicKey | undefined>;

  /**
   * Creates an instance of FhenixClient.
   * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
   * @param {InstanceParams} params - Parameters to initialize the client.
   */
  public constructor(params: InstanceParams) {
    isPlainObject(params);

    if (params?.provider === undefined) {
      params.provider = new JsonRpcProvider("http://localhost:8545");
    }

    //@ts-expect-error
    const isInTest = typeof global?.it === "function";
    this.fhePublicKey = Promise.resolve(undefined); // make Typescript shut up

    const { provider } = params;

    // in most cases we will want to init the fhevm library - except if this is used outside of the browser, in which
    // case this should be called with initSdk = false (tests, for instance)
    /// #if DEBUG
    if (isInTest) {
      this.fhePublicKey = FhenixClient.getFheKeyFromProvider(provider);
    }
    /// #else
    if (!isInTest) {
      const asyncInitFhevm: () => Promise<void> = async () => {
        try {
          if (params?.initSdk !== false) {
            const { initFhevm } = await import("./init");
            await initFhevm();
          }
        } catch (err) {
          throw new Error(
            `Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`,
          );
        }
      };

      this.fhePublicKey = asyncInitFhevm().then(() =>
        FhenixClient.getFheKeyFromProvider(provider),
      );
    }
    /// #endif
  }

  // Encryption Methods

  /**
   * Encrypts a Uint8 value using the stored public key.
   * @param {number} value - The Uint8 value to encrypt.
   * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
   */
  async encrypt_uint8(value: number): Promise<Uint8Array> {
    isNumber(value);

    const fhePublicKey = await this.fhePublicKey;
    if (!fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }
    ValidateUintInRange(value, MAX_UINT8, 0);
    return tfheEncrypt.encrypt_uint8(value, fhePublicKey);
  }

  /**
   * Encrypts a Uint16 value using the stored public key.
   * @param {number} value - The Uint16 value to encrypt.
   * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
   */
  async encrypt_uint16(value: number): Promise<Uint8Array> {
    isNumber(value);

    const fhePublicKey = await this.fhePublicKey;
    if (!fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }
    ValidateUintInRange(value, MAX_UINT16, 0);
    return tfheEncrypt.encrypt_uint16(value, fhePublicKey);
  }

  /**
   * Encrypts a Uint32 value using the stored public key.
   * @param {number} value - The Uint32 value to encrypt.
   * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
   */
  async encrypt_uint32(value: number) {
    isNumber(value);

    const fhePublicKey = await this.fhePublicKey;
    if (!fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }
    ValidateUintInRange(value, MAX_UINT32, 0);
    return tfheEncrypt.encrypt_uint32(value, fhePublicKey);
  }

  /**
   * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
   * @param {number} value - The numeric value to encrypt.
   * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
   * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
   */
  async encrypt(value: number, type?: EncryptionTypes): Promise<Uint8Array> {
    isNumber(value);

    let outputSize = type;

    const fhePublicKey = await this.fhePublicKey;
    if (!fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }

    // choose the most efficient ciphertext size if not selected
    if (!outputSize) {
      if (value < MAX_UINT8) {
        outputSize = EncryptionTypes.uint8;
      } else if (value < MAX_UINT16) {
        outputSize = EncryptionTypes.uint16;
      } else if (value < MAX_UINT32) {
        outputSize = EncryptionTypes.uint32;
      } else {
        throw new Error(`Encryption input must be smaller than ${MAX_UINT32}`);
      }
    }

    switch (outputSize) {
      case EncryptionTypes.uint8:
        ValidateUintInRange(value, MAX_UINT8, 0);
        break;
      case EncryptionTypes.uint16:
        ValidateUintInRange(value, MAX_UINT16, 0);
        break;
      case EncryptionTypes.uint32:
        ValidateUintInRange(value, MAX_UINT32, 0);
        break;
    }

    return tfheEncrypt.encrypt(value, fhePublicKey, type);
  }

  // Unsealing Method

  /**
   * Unseals an encrypted message using the stored permit for a specific contract address.
   * @param {string} contractAddress - The address of the contract.
   * @param {string} ciphertext - The encrypted message to unseal.
   * @returns {any} - The unsealed message.
   */
  unseal(contractAddress: string, ciphertext: string) {
    isAddress(contractAddress);
    isString(ciphertext);

    if (!this.hasPermit(contractAddress)) {
      throw new Error(`Missing keypair for ${contractAddress}`);
    }

    return this.permits[contractAddress].sealingKey.unseal(ciphertext);
  }

  // Permit Management Methods

  /**
   * Retrieves the stored permit for a specific contract address.
   * @param {string} contractAddress - The address of the contract.
   * @returns {Permit} - The permit associated with the contract address.
   */
  getPermit(contractAddress: string) {
    if (!this.hasPermit(contractAddress)) {
      throw new Error(`Missing keypair for ${contractAddress}`);
    }

    return this.permits[contractAddress];
  }

  /**
   * Stores a permit for a specific contract address. Will overwrite any existing permit for the same contract address.
   * Does not store the permit in localstorage (should it?)
   * @param {Permit} permit - The permit to store.
   */
  storePermit(permit: Permit) {
    this.permits[permit.contractAddress] = permit;
  }

  /**
   * Removes a stored permit for a specific contract address.
   * @param {string} contractAddress - The address of the contract.
   */
  removePermit(contractAddress: string) {
    if (this.hasPermit(contractAddress)) {
      delete this.permits[contractAddress];
    }
  }

  /**
   * Checks if a permit exists for a specific contract address.
   * @param {string} contractAddress - The address of the contract.
   * @returns {boolean} - True if a permit exists, false otherwise.
   */
  hasPermit(contractAddress: string): boolean {
    return this.permits[contractAddress] !== null;
  }

  /**
   * Exports all stored permits.
   * @returns {ContractPermits} - All stored permits.
   */
  exportPermits() {
    return this.permits;
  }

  extractPermitPermission(permit: Permit): Permission {
    return {
      signature: permit.signature,
      publicKey: permit.publicKey,
    };
  }

  // Private helper methods

  /**
   * Retrieves the FHE public key from the provider.
   * @param {SupportedProvider} provider - The provider from which to retrieve the key.
   * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
   */
  private static async getFheKeyFromProvider(
    provider: SupportedProvider,
  ): Promise<TfheCompactPublicKey> {
    const requestMethod = determineRequestMethod(provider);

    const chainIdP = requestMethod(provider, "eth_chainId").catch(
      (err: Error) => {
        throw Error(`Error while requesting chainId from provider: ${err}`);
      },
    );

    const networkPkAbi = new Interface(["function getNetworkPublicKey()"]);
    const callData = networkPkAbi.encodeFunctionData("getNetworkPublicKey");
    const callParams = [{ to: FheOpsAddress, data: callData }, "latest"];

    const publicKeyP = requestMethod(provider, "eth_call", callParams).catch(
      (err: Error) => {
        throw Error(
          `Error while requesting network public key from provider: ${JSON.stringify(
            err,
          )}`,
        );
      },
    );

    const [chainId, publicKey] = await Promise.all([chainIdP, publicKeyP]);

    const chainIdNum: number = parseInt(chainId, 16);
    if (isNaN(chainIdNum)) {
      throw new Error(
        `received non-hex number from chainId request: "${chainId}"`,
      );
    }

    if (typeof publicKey !== "string") {
      throw new Error("Error using publicKey from provider: expected string");
    }

    const abiCoder = AbiCoder.defaultAbiCoder();
    const publicKeyDecoded = abiCoder.decode(["bytes"], publicKey)[0];
    const buff = fromHexString(publicKeyDecoded);

    try {
      return TfheCompactPublicKey.deserialize(buff);
    } catch (err) {
      throw new Error(
        `Error deserializing public key: did you initialize fhenix.js with "initFhevm()"? ${err}`,
      );
    }
  }
}
