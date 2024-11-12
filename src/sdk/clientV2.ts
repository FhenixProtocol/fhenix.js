import { TfheCompactPublicKey } from "./fhe/fhe.js";
import {
  fromHexString,
  ValidateUintInRange,
  toABIEncodedUint32,
} from "./utils.js";
import {
  EncryptedAddress,
  EncryptedBool,
  EncryptedNumber,
  EncryptedUint128,
  EncryptedUint16,
  EncryptedUint256,
  EncryptedUint32,
  EncryptedUint64,
  EncryptedUint8,
  EncryptionTypes,
} from "./types.js";

import {
  FheOpsAddress,
  MAX_UINT16,
  MAX_UINT32,
  MAX_UINT8,
  PUBLIC_KEY_LENGTH_MIN,
} from "./consts.js";
import * as tfheEncrypt from "./encrypt.js";
import {
  isBigIntOrHexString,
  isNumber,
  isPlainObject,
  isString,
} from "./validation.js";
import { InitFhevm } from "./init.js";
import {
  generatePermitV2,
  getAllExistingPermitV2s,
  getPermitV2FromLocalstorage,
  getPermitV2Hash,
  PermissionV2,
  PermitV2,
  PermitV2Options,
  removePermitV2FromLocalStorage,
  SendFn,
  SignTypedDataFn,
  storePermitV2InLocalStorage,
} from "../extensions/access_control/permitV2/index.js";

export class FhenixClientV2 {
  private account: string | undefined;
  private chainId: string | undefined;
  private securityZones: number[] = [];

  private send: SendFn;
  private signTypedData: SignTypedDataFn;

  private permits: Record<string, PermitV2> = {};
  private fhePublicKeys: Array<TfheCompactPublicKey | undefined>;

  private fhevmInitialized: boolean = false;
  private fhePublicKeysInitialized: boolean = false;

  private activePermitHash: string | undefined;

  /**
   * Creates an instance of FhenixClient.
   * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
   * @param {InstanceParams} params - Parameters to initialize the client.
   */
  public constructor(params: { send: SendFn; signTypedData: SignTypedDataFn }) {
    isPlainObject(params);
  }

  // Called when initializing or updating the provider
  // Should re-initialize when account or chain changes
  public async initialize(params: {
    account: string;
    send: SendFn;
    signTypedData: SignTypedDataFn;
    securityZones?: number[];
    ignoreErrors?: boolean;
  }): Promise<void> {
    const {
      account,
      send,
      signTypedData,
      ignoreErrors = false,
      securityZones = [0],
    } = params;

    // FHEVM

    if (!this.fhevmInitialized) {
      await InitFhevm().catch((err: unknown) => {
        if (ignoreErrors) {
          return undefined;
        } else {
          throw new Error(
            `Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`,
          );
        }
      });
      this.fhevmInitialized = true;
    }

    // PROVIDER

    // TODO: Pass account to localstorage, store activePermitHash as well
    // if (account !== this.account) this.activePermitHash = null

    this.account = account;
    this.send = send;
    this.signTypedData = signTypedData;

    if (!this.account || !this.send || !this.signTypedData) {
      throw new Error(
        "Failed to initialize Fhenix Client - must include account, send function, and signTypedData functions",
      );
    }

    const chainId = await this.getChainIdFromProvider(this.send);
    if (chainId !== this.chainId) this.fhePublicKeysInitialized = false;
    this.chainId = chainId;

    if (securityZones !== this.securityZones)
      this.fhePublicKeysInitialized = false;
    this.securityZones = securityZones;

    // FHE KEYS

    if (securityZones.length === 0)
      throw new Error("No securityZones provided");

    this.fhePublicKeys = await Promise.all(
      securityZones.map((securityZone) =>
        FhenixClientV2.getFheKeyFromProvider(
          this.chainId,
          this.send,
          securityZone,
        ),
      ),
    );
    this.fhePublicKeysInitialized = true;
  }

  // Encryption Methods

  private _getPublicKey(securityZone: number) {
    if (!this.fhevmInitialized) {
      throw new Error("FHEVM not initialized");
    }
    if (!this.fhePublicKeysInitialized) {
      throw new Error("FHE Public Keys not initialized");
    }
    if (!this.fhePublicKeys[securityZone]) {
      throw new Error(
        `Public key for security zone ${securityZone} not initialized`,
      );
    }

    return this.fhePublicKeys[securityZone];
  }

  /**
   * Encrypts a Uint8 value using the stored public key.
   * @param {number} value - The Uint8 value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedBool} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
   */
  encrypt_bool(value: boolean, securityZone: number = 0): EncryptedBool {
    const fhePublicKey = this._getPublicKey(securityZone);
    return tfheEncrypt.encrypt_bool(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts a Uint8 value using the stored public key.
   * @param {number} value - The Uint8 value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
   */
  encrypt_uint8(value: number, securityZone: number = 0): EncryptedUint8 {
    isNumber(value);

    const fhePublicKey = this._getPublicKey(securityZone);
    ValidateUintInRange(value, MAX_UINT8, 0);

    return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts a Uint16 value using the stored public key.
   * @param {number} value - The Uint16 value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
   */
  encrypt_uint16(value: number, securityZone: number = 0): EncryptedUint16 {
    isNumber(value);

    const fhePublicKey = this._getPublicKey(securityZone);
    ValidateUintInRange(value, MAX_UINT16, 0);
    return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts a Uint32 value using the stored public key.
   * @param {number} value - The Uint32 value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
   */
  encrypt_uint32(value: number, securityZone: number = 0): EncryptedUint32 {
    isNumber(value);

    const fhePublicKey = this._getPublicKey(securityZone);

    ValidateUintInRange(value, MAX_UINT32, 0);
    return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts a Uint64 value using the stored public key.
   * @param {bigint | string} value - The Uint32 value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedUint64} - The encrypted value serialized as EncryptedUint64. Use the .data property to access the Uint8Array.
   */
  encrypt_uint64(
    value: bigint | string,
    securityZone: number = 0,
  ): EncryptedUint64 {
    isBigIntOrHexString(value);

    const fhePublicKey = this._getPublicKey(securityZone);

    // ValidateUintInRange(value, MAX_UINT64, 0);
    return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts a Uint128 value using the stored public key.
   * @param {bigint | string} value - The Uint128 value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedUint128} - The encrypted value serialized as EncryptedUint128. Use the .data property to access the Uint8Array.
   */
  encrypt_uint128(
    value: bigint | string,
    securityZone: number = 0,
  ): EncryptedUint128 {
    isBigIntOrHexString(value);

    const fhePublicKey = this._getPublicKey(securityZone);

    // ValidateUintInRange(value, MAX_UINT64, 0);
    return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts a Uint256 value using the stored public key.
   * @param {bigint | string} value - The Uint256 value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedUint256} - The encrypted value serialized as EncryptedUint256. Use the .data property to access the Uint8Array.
   */
  encrypt_uint256(
    value: bigint | string,
    securityZone: number = 0,
  ): EncryptedUint256 {
    isBigIntOrHexString(value);

    const fhePublicKey = this._getPublicKey(securityZone);

    // ValidateUintInRange(value, MAX_UINT64, 0);
    return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts an Address (Uint160) value using the stored public key.
   * @param {bigint | string} value - The Address (Uint160) value to encrypt.
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedAddress} - The encrypted value serialized as EncryptedAddress. Use the .data property to access the Uint8Array.
   */
  encrypt_address(
    value: bigint | string,
    securityZone: number = 0,
  ): EncryptedAddress {
    isBigIntOrHexString(value);

    const fhePublicKey = this._getPublicKey(securityZone);

    // ValidateUintInRange(value, MAX_UINT64, 0);
    return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
  }

  /**
   * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
   * @param {number} value - The numeric value to encrypt.
   * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
   * @param securityZone - The security zone for which to encrypt the value (default 0).
   * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
   */
  encrypt(
    value: number,
    type?: EncryptionTypes,
    securityZone: number = 0,
  ): EncryptedNumber {
    isNumber(value);

    let outputSize = type;

    const fhePublicKey = this._getPublicKey(securityZone);

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
      default:
    }

    return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
  }

  // Unsealing Method

  /**
   * Unseals an encrypted message using the stored permit for a specific contract address.
   *
   * @param {string} ciphertext - The encrypted message to unseal.
   * @param {string} permitV2Hash - The hash of the permit to use for this operation, defaults to active permitV2 hash
   * @returns bigint - The unsealed message.
   */
  unseal(ciphertext: string, hash?: string): bigint {
    isString(ciphertext);
    const resolvedHash = hash ?? this.activePermitHash;
    if (resolvedHash == null) {
      throw new Error(
        `PermitV2 hash not provided and active PermitV2 not found`,
      );
    }

    const permit = this.permits[resolvedHash];
    if (permit == null) {
      throw new Error(`PermitV2 with hash ${hash} not found`);
    }

    return permit.sealingPair.unseal(ciphertext);
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
  async generatePermitV2(options: PermitV2Options) {
    if (this.account == null || this.chainId == null)
      throw new Error("Cannot generate permit without chainId or account");

    const permit = await generatePermitV2(
      this.account,
      this.chainId,
      options,
      this.signTypedData,
    );

    // Permit has already been put into local storage, it can be inserted directly into `this.permits`
    const hash = getPermitV2Hash(permit);
    this.permits[hash] = permit;
    this.activePermitHash = hash;

    return permit;
  }

  /**
   * Reusable permit loading and storing from local storage
   * @param {string} account - The address of the user account.
   * @param {string} hash - Hashed identifier of permitV2 data.
   * @returns {PermitV2 | undefined} - The permit loaded from local storage
   */
  private _loadPermitFromLocalStorage(
    account: string,
    hash: string,
  ): PermitV2 | undefined {
    const fromLs = getPermitV2FromLocalstorage(account, hash);
    if (fromLs == null) return undefined;

    this.permits[hash] = fromLs;
    return fromLs;
  }

  /**
   * Retrieves the stored permit for a specific contract address.
   * @param {string} account - The address of the user account.
   * @param {string} hash - Hashed identifier of permitV2 data.
   * @returns {PermitV2 | undefined} - The permit associated with the contract address.
   */
  getPermit(account: string, hash: string): PermitV2 | undefined {
    const permitFromLs = this._loadPermitFromLocalStorage(account, hash);
    return permitFromLs ?? this.permits[hash];
  }

  /**
   * Retrieves all stored permits for a specific account.
   * @param {string} account - The address of the user account.
   * @returns {Record<string, PermitV2>} - The permits associated with each contract address.
   */
  loadAllPermitsFromLocalStorage(account: string): Record<string, PermitV2> {
    const existingPermits = getAllExistingPermitV2s(account);

    Object.keys(existingPermits).forEach((hash) => {
      this.permits[hash] = existingPermits[hash];
    });

    return this.permits;
  }

  /**
   * Stores a permit in localStorage, will overwrite existing permit with identical hash contents
   * @param {string} account - The address of the user account.
   * @param {PermitV2} permit - The permit to store.
   */
  storePermit(account: string, permit: PermitV2) {
    storePermitV2InLocalStorage(account, permit);
    this.permits[getPermitV2Hash(permit)] = permit;
  }

  /**
   * Removes a stored permit for a specific contract address.
   * @param {string} account - The address of the user account.
   * @param {string} hash - The hashed permitV2 data.
   */
  removePermit(account: string, hash: string) {
    if (this.hasPermit(account, hash)) {
      removePermitV2FromLocalStorage(account, hash);
      delete this.permits[hash];
    }
  }

  /**
   * Checks if a permit exists for a specific contract address.
   * @param {string} account - The address of the user account.
   * @param {string} hash - The hashed permitV2 data.
   * @returns {boolean} - True if a permit exists, false otherwise.
   */
  hasPermit(account: string, hash: string): boolean {
    const permitFromLs = this._loadPermitFromLocalStorage(account, hash);
    if (permitFromLs != null) return true;
    return this.permits[hash] != null;
  }

  /**
   * Exports all stored permits.
   * @returns {ContractPermits} - All stored permits.
   */
  exportPermits() {
    return this.permits;
  }

  extractPermitPermission({ sealingPair, ...permit }: PermitV2): PermissionV2 {
    return {
      ...permit,
      sealingKey: `0x${sealingPair.publicKey}`,
    };
  }

  // Private helper methods

  async getChainIdFromProvider(send: SendFn): Promise<string> {
    const chainId = (await send("eth_chainId").catch((err: Error) => {
      throw Error(`Error while requesting chainId from provider: ${err}`);
    })) as string;

    if (isNaN(parseInt(chainId, 16))) {
      throw new Error(
        `received non-hex number from chainId request: "${chainId}"`,
      );
    }

    return chainId;
  }

  /**
   * Retrieves the FHE public key from the provider.
   * @param {SupportedProvider} provider - The provider from which to retrieve the key.
   * @param securityZone - The security zone for which to retrieve the key (default 0).
   * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
   */
  static async getFheKeyFromProvider(
    chainId: string | undefined,
    send: SendFn,
    securityZone: number = 0,
  ): Promise<TfheCompactPublicKey> {
    const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
    const callData = funcSig + toABIEncodedUint32(securityZone);

    const callParams = [{ to: FheOpsAddress, data: callData }, "latest"];

    const publicKeyP = send("eth_call", callParams).catch((err: Error) => {
      throw Error(
        `Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(
          err,
        )}`,
      );
    });

    const [publicKey] = await Promise.all([publicKeyP]);

    const chainIdNum: number = parseInt(chainId ?? "NaN", 16);
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

    // todo (eshel) verify this
    // magically know how to decode rlp or w/e returns from the evm json-rpc
    const buff = fromHexString(publicKey.slice(130));

    try {
      return TfheCompactPublicKey.deserialize(buff);
    } catch (err) {
      throw new Error(`Error deserializing public key ${err}`);
    }
  }
}
