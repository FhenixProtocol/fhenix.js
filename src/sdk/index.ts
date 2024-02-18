import { TfheCompactPublicKey } from "node-tfhe";
import { fromHexString, isAddress, ValidateUintInRange } from "./utils";
import {
  ContractPermits,
  determineRequestMethod,
  EncryptedNumber,
  EncryptedUint16,
  EncryptedUint32,
  EncryptedUint8,
  EncryptionTypes,
  InstanceParams,
  SupportedProvider,
} from "./types";

import {
  generatePermit,
  getPermitFromLocalstorage,
  Permission,
  Permit,
  PermitSigner,
} from "../extensions/access_control";

import { AbiCoder, Interface, JsonRpcProvider } from "ethers";

import {
  FheOpsAddress,
  MAX_UINT16,
  MAX_UINT32,
  MAX_UINT8,
  PUBLIC_KEY_LENGTH_MIN,
} from "./consts";
import * as tfheEncrypt from "./encrypt";
import { isNumber, isPlainObject, isString } from "./validation";

/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
export class FhenixClient {
  private permits: ContractPermits = {};
  public fhePublicKey: Promise<TfheCompactPublicKey | undefined>;
  protected provider: SupportedProvider;
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

    const { provider, ignoreErrors } = params;

    this.provider = provider;

    // in most cases we will want to init the fhevm library - except if this is used outside of the browser, in which
    // case this should be called with initSdk = false (tests, for instance)

    /// #if DEBUG
    this.fhePublicKey = FhenixClient.getFheKeyFromProvider(provider).catch(
      (err) => {
        if (ignoreErrors) {
          return undefined;
        } else {
          throw new Error(
            `Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`,
          );
        }
      },
    );

    /// #else
    const asyncInitFhevm: () => Promise<void> = async () => {
      try {
        const { initFhevm } = await import("./init");
        await initFhevm();
      } catch (err) {
        throw new Error(
          `Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`,
        );
      }
    };
    if (params?.initSdk !== false) {
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
   * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
   */
  async encrypt_uint8(value: number): Promise<EncryptedUint8> {
    isNumber(value);

    const fhePublicKey = await this._getPublicKey();
    ValidateUintInRange(value, MAX_UINT8, 0);
    return tfheEncrypt.encrypt_uint8(value, fhePublicKey);
  }

  private async _getPublicKey() {
    let fhePublicKey = await this.fhePublicKey;
    if (!fhePublicKey) {
      // try again to get the public key - maybe the 1st time the chain wasn't up or something
      this.fhePublicKey = FhenixClient.getFheKeyFromProvider(this.provider);
      fhePublicKey = await this.fhePublicKey;
      if (!fhePublicKey) {
        throw new Error("Public key somehow not initialized");
      }
    }
    return fhePublicKey;
  }

  /**
   * Encrypts a Uint16 value using the stored public key.
   * @param {number} value - The Uint16 value to encrypt.
   * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
   */
  async encrypt_uint16(value: number): Promise<EncryptedUint16> {
    isNumber(value);

    const fhePublicKey = await this._getPublicKey();
    ValidateUintInRange(value, MAX_UINT16, 0);
    return tfheEncrypt.encrypt_uint16(value, fhePublicKey);
  }

  /**
   * Encrypts a Uint32 value using the stored public key.
   * @param {number} value - The Uint32 value to encrypt.
   * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
   */
  async encrypt_uint32(value: number): Promise<EncryptedUint32> {
    isNumber(value);

    const fhePublicKey = await this._getPublicKey();

    ValidateUintInRange(value, MAX_UINT32, 0);
    return tfheEncrypt.encrypt_uint32(value, fhePublicKey);
  }

  /**
   * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
   * @param {number} value - The numeric value to encrypt.
   * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
   * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
   */
  async encrypt(
    value: number,
    type?: EncryptionTypes,
  ): Promise<EncryptedNumber> {
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
   * @returns bigint - The unsealed message.
   */
  unseal(contractAddress: string, ciphertext: string): bigint {
    isAddress(contractAddress);
    isString(ciphertext);

    if (!this.hasPermit(contractAddress)) {
      throw new Error(`Missing keypair for ${contractAddress}`);
    }

    return this.permits[contractAddress].sealingKey.unseal(ciphertext);
  }

  // Permit Management Methods
  /**
   * Creates a new permit for a specific contract address. Also saves the permit to localstorage (if available)
   * @param {string} contractAddress - The address of the contract.
   * @param {SupportedProvider} provider - The provider from which to sign the permit - must container a signer.
   * @param signer - the signer to use to sign the permit if provider does not support signing (e.g. hardhat)
   * @returns Permit - The permit associated with the contract address.
   *
   * @throws {Error} - If the provider does not contain a signer, or if a provider is not set
   */
  async generatePermit(
    contractAddress: string,
    provider?: SupportedProvider,
    signer?: PermitSigner,
  ) {
    if (!provider && this.provider === undefined) {
      throw new Error("error getting provider");
    }

    const permit = await generatePermit(
      contractAddress,
      provider || this.provider!,
      signer,
    );
    this.storePermit(permit);
    return permit;
  }

  /**
   * Retrieves the stored permit for a specific contract address.
   * @param {string} contractAddress - The address of the contract.
   * @returns {Permit} - The permit associated with the contract address.
   */
  getPermit(contractAddress: string): Permit | undefined {
    const fromLs = getPermitFromLocalstorage(contractAddress);
    if (fromLs) {
      this.permits[contractAddress] = fromLs;
      return fromLs;
    }

    if (!this.hasPermit(contractAddress)) {
      return undefined;
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

    if (publicKey.length < PUBLIC_KEY_LENGTH_MIN) {
      throw new Error(
        `Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`,
      );
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
