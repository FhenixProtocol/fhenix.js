/* eslint-disable @typescript-eslint/no-explicit-any */
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
  FheUType,
  isEncryptableItem,
  MappedEncryptedTypes,
  Result,
  ResultErr,
  ResultOk,
} from "./types.js";

import {
  FheOpsAddress,
  MAX_UINT16,
  MAX_UINT32,
  MAX_UINT8,
  PUBLIC_KEY_LENGTH_MIN,
} from "./consts.js";
import * as tfheEncrypt from "./encrypt.js";
import { isBigIntOrHexString, isNumber, isString } from "./validation.js";
import { InitFhevm } from "./init.js";
import {
  getPermit as getPermitFromStore,
  setPermit as setPermitInStore,
  setActivePermitHash as setActivePermitHashInStore,
  getPermits as getPermitsFromStore,
  getActivePermitHash as getActivePermitHashFromStore,
  getFheKey,
  setFheKey,
  getActivePermit as getActivePermitFromStore,
} from "../extensions/store.js";
import {
  SendFn,
  SignTypedDataFn,
  PermitV2Interface,
  PermitV2Options,
  PermissionV2,
} from "../extensions/types.js";
import { PermitV2 } from "./permitV2.js";

export class FhenixClientV2 {
  public account: string | undefined;
  public chainId: string | undefined;
  public securityZones: number[] = [];

  private send: SendFn | undefined;
  private signTypedData: SignTypedDataFn | undefined;

  public fhevmInitialized: boolean = false;
  public fhePublicKeysInitialized: boolean = false;

  /**
   * Creates an instance of FhenixClient.
   * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
   * @param {InstanceParams} params - Parameters to initialize the client.
   */
  public constructor() {}

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

    await Promise.all(
      securityZones.map((securityZone) =>
        FhenixClientV2.getFheKeyFromProvider(
          this.chainId,
          securityZone,
          this.send,
        ),
      ),
    );
    this.fhePublicKeysInitialized = true;
  }

  // Encrypt

  private _getPublicKey(securityZone: number) {
    if (!this.fhevmInitialized) {
      throw new Error("FHEVM not initialized");
    }
    if (!this.fhePublicKeysInitialized) {
      throw new Error("FHE Public Keys not initialized");
    }

    const key = getFheKey(this.chainId, securityZone);
    if (!key) {
      throw new Error(
        `Public key for security zone ${securityZone} not initialized`,
      );
    }

    return key;
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

  encryptTyped<T extends any[]>(item: [...T]): [...MappedEncryptedTypes<T>];
  encryptTyped<T>(item: T): MappedEncryptedTypes<T>;
  encryptTyped<T>(item: T) {
    // Permission
    if (item === "permission") {
      return this.getPermission();
    }

    // EncryptableItem
    if (isEncryptableItem(item)) {
      switch (item.utype) {
        case FheUType.bool:
          return this.encrypt_bool(item.data, item.securityZone);
        case FheUType.uint8:
          return this.encrypt_uint8(item.data, item.securityZone);
        case FheUType.uint16:
          return this.encrypt_uint16(item.data, item.securityZone);
        case FheUType.uint32:
          return this.encrypt_uint32(item.data, item.securityZone);
        case FheUType.uint64:
          return this.encrypt_uint64(item.data, item.securityZone);
        case FheUType.uint128:
          return this.encrypt_uint128(item.data, item.securityZone);
        case FheUType.uint256:
          return this.encrypt_uint256(item.data, item.securityZone);
        case FheUType.address:
          return this.encrypt_address(item.data, item.securityZone);
      }
    }

    // Object | Array
    if (typeof item === "object" && item !== null) {
      if (Array.isArray(item)) {
        // Array - recurse
        return item.map((nestedItem) => this.encryptTyped(nestedItem));
      } else {
        // Object - recurse
        const result: any = {};
        for (const key in item) {
          result[key] = this.encryptTyped(item[key]);
        }
        return result;
      }
    }

    // Primitive
    return item;
  }

  // Permits & Unsealing

  /**
   * Creates a new permit with options, prompts user for signature.
   * Handles all `permit.type`s, and prompts for the correct signature type.
   * The created PermitV2 will be inserted into the store and marked as the active permit.
   * NOTE: This is a wrapper around `PermitV2.create` and `PermitV2.sign`
   *
   * @param {PermitV2Options} options - Partial PermitV2 fields to create the Permit with
   * @returns {PermitV2} - Newly created PermitV2
   */
  async createPermit(options: PermitV2Options): Promise<PermitV2> {
    if (this.account == null || this.chainId == null)
      throw new Error("Cannot generate permit without chainId or account");

    if (this.send == null || this.signTypedData == null)
      throw new Error(
        "Cannot generate permit, `send` or `signTypedData` is null",
      );

    const permit = await PermitV2.create(options);
    await permit.sign(this.chainId, this.signTypedData);

    setPermitInStore(this.account, permit);
    setActivePermitHashInStore(this.account, permit.getHash());

    return permit;
  }

  /**
   * Imports a fully formed existing permit, expected to be valid.
   * Does not ask for user signature, expects to already be populated.
   * Will throw an error if the imported permit is invalid, see `PermitV2.isValid`.
   * The imported PermitV2 will be inserted into the store and marked as the active permit.
   *
   * @param {PermitV2Interface} imported - Existing permit
   */
  async importPermit(imported: PermitV2Interface) {
    if (this.account == null)
      throw new Error("Cannot generate permit without account");

    const permit = await PermitV2.create(imported);

    const { valid, error } = permit.isValid();
    if (!valid) {
      throw new Error(`Imported permit is invalid: ${error}`);
    }

    setPermitInStore(this.account, permit);
    setActivePermitHashInStore(this.account, permit.getHash());
  }

  /**
   * Selects the active permit using its hash.
   * If the hash is not found in the stored permits store, throws an error.
   * The matched permit will be marked as the active permit.
   *
   * @param {string} hash - The `PermitV2.getHash` of the target permit.
   */
  async selectActivePermit(hash: string) {
    if (this.account == null)
      throw new Error("Cannot select permit without associated account");

    const permit = getPermitFromStore(this.account, hash);
    if (permit == null) return;

    setActivePermitHashInStore(this.account, permit.getHash());
  }

  /**
   * Retrieves a stored permit based on its hash.
   * If no hash is provided, the currently active permit will be retrieved.
   *
   * @param {string} hash - Optional `PermitV2.getHash` of the permit.
   * @returns {Result<PermitV2>} - The active permit or permit associated with `hash` as a Result object.
   */
  getPermit(hash?: string): Result<PermitV2> {
    if (this.account == null) return ResultErr("account missing");

    if (hash == null) {
      const permit = getActivePermitFromStore(this.account);
      if (permit == null) return ResultErr(`active permit not found`);

      return ResultOk(permit);
    }

    const permit = getPermitFromStore(this.account, hash);
    if (permit == null)
      return ResultErr(`permit with hash <${hash}> not found`);

    return ResultOk(permit);
  }

  /**
   * Retrieves a stored permission based on the permit's hash.
   * If no hash is provided, the currently active permit will be used.
   * The `PermissionV2` is extracted from the permit.
   *
   * @param {string} hash - Optional hash of the permission to get, defaults to active permit's permission
   * @returns {Result<PermissionV2>} - The active permission or permission associated with `hash`, as a result object.
   */
  getPermission(hash?: string): Result<PermissionV2> {
    const permitResult = this.getPermit(hash);
    if (!permitResult.success) return permitResult;

    return ResultOk(permitResult.data.getPermission());
  }

  /**
   * Exports all stored permits.
   * @returns {Result<Record<string, PermitV2>>} - All stored permits.
   */
  getAllPermits(): Result<Record<string, PermitV2>> {
    if (this.account == null) return ResultErr("account missing");
    return ResultOk(getPermitsFromStore(this.account));
  }

  /**
   * Unseals an encrypted message using the stored permit for a specific contract address.
   * NOTE: Wrapper around `PermitV2.unseal`
   *
   * @param {string} ciphertext - The encrypted message to unseal.
   * @param {string} account - Users address, defaults to this.account
   * @param {string} hash - The hash of the permit to use for this operation, defaults to active permitV2 hash
   * @returns bigint - The unsealed message.
   */
  unseal(ciphertext: string, account?: string, hash?: string): bigint {
    isString(ciphertext);
    const resolvedAccount = account ?? this.account;
    const resolvedHash = hash ?? getActivePermitHashFromStore(resolvedAccount);
    if (resolvedAccount == null || resolvedHash == null) {
      throw new Error(
        `PermitV2 hash not provided and active PermitV2 not found`,
      );
    }

    const permit = getPermitFromStore(resolvedAccount, resolvedHash);
    if (permit == null) {
      throw new Error(
        `PermitV2 with account <${account}> and hash <${hash}> not found`,
      );
    }

    return permit.unseal(ciphertext);
  }

  // Helpers

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
    securityZone: number = 0,
    send: SendFn | undefined,
  ): Promise<TfheCompactPublicKey> {
    const storedKey = getFheKey(chainId, securityZone);
    if (storedKey != null) return storedKey;

    const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
    const callData = funcSig + toABIEncodedUint32(securityZone);

    const callParams = [{ to: FheOpsAddress, data: callData }, "latest"];

    const publicKey = await send?.("eth_call", callParams).catch(
      (err: Error) => {
        throw Error(
          `Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(
            err,
          )}`,
        );
      },
    );

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
      const key = TfheCompactPublicKey.deserialize(buff);
      setFheKey(chainId, securityZone, key);
      return key;
    } catch (err) {
      throw new Error(`Error deserializing public key ${err}`);
    }
  }
}
