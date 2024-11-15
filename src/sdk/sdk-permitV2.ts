/* eslint-disable @typescript-eslint/no-explicit-any */
import { MAX_UINT16, MAX_UINT32, MAX_UINT8 } from "./consts.js";
import { ValidateUintInRange } from "./utils.js";
import * as tfheEncrypt from "./encrypt.js";
import { PermitV2 } from "./permitV2.js";
import {
  EncryptedNumber,
  EncryptionTypes,
  FheUType,
  isEncryptableItem,
  MappedEncryptedTypes,
  Result,
  ResultErr,
  ResultOk,
  PermissionV2,
  PermitV2Interface,
  PermitV2Options,
} from "./types.js";
import {
  getActivePermit,
  getPermits as getPermitsFromStore,
  getPermit as getPermitFromStore,
  setActivePermitHash,
  setPermit,
  getActivePermitHash,
} from "../extensions/store/permits.js";
import { isString } from "./validation.js";
import {
  _sdkStore,
  _store_getConnectedChainFheKey,
  _store_getFheKey,
  _store_initialize,
  InitParams,
} from "../extensions/store/sdk.js";

const initialize = async (init: InitParams) => {
  const { account, send, signTypedData, securityZones = [0] } = init;

  if (account == null) throw new Error("initialize :: missing account");
  if (send == null) throw new Error("initialize :: missing send function");
  if (signTypedData == null)
    throw new Error("initialize :: missing signTypedData function");
  if (securityZones.length === 0)
    throw new Error("initialize :: no securityZones provided");

  await _store_initialize(init);
};

// Permit

/**
 * Creates a new permit with options, prompts user for signature.
 * Handles all `permit.type`s, and prompts for the correct signature type.
 * The created PermitV2 will be inserted into the store and marked as the active permit.
 * NOTE: This is a wrapper around `PermitV2.create` and `PermitV2.sign`
 *
 * @param {PermitV2Options} options - Partial PermitV2 fields to create the Permit with
 * @returns {PermitV2} - Newly created PermitV2
 */
const createPermit = async (options: PermitV2Options): Promise<PermitV2> => {
  const state = _sdkStore.getState();

  if (!state.initialized)
    throw new Error("createPermit :: fhenixsdk not initialized");
  if (state.account == null) throw new Error("createPermit :: missing account");
  if (state.chainId == null) throw new Error("createPermit :: missing chainId");
  if (state.send == null)
    throw new Error("createPermit :: missing send function");
  if (state.signTypedData == null)
    throw new Error("createPermit :: missing signTypedData function");

  const permit = await PermitV2.create(options);
  await permit.sign(state.chainId, state.signTypedData);

  setPermit(state.account, permit);
  setActivePermitHash(state.account, permit.getHash());

  return permit;
};

/**
 * Imports a fully formed existing permit, expected to be valid.
 * Does not ask for user signature, expects to already be populated.
 * Will throw an error if the imported permit is invalid, see `PermitV2.isValid`.
 * The imported PermitV2 will be inserted into the store and marked as the active permit.
 *
 * @param {PermitV2Interface} imported - Existing permit
 */
const importPermit = async (imported: PermitV2Interface) => {
  const state = _sdkStore.getState();

  if (!state.initialized)
    throw new Error("importPermit :: fhenixsdk not initialized");
  if (state.account == null) throw new Error("importPermit :: missing account");

  const permit = await PermitV2.create(imported);

  const { valid, error } = permit.isValid();
  if (!valid) {
    throw new Error(`Imported permit is invalid: ${error}`);
  }

  setPermit(state.account, permit);
  setActivePermitHash(state.account, permit.getHash());
};

/**
 * Selects the active permit using its hash.
 * If the hash is not found in the stored permits store, throws an error.
 * The matched permit will be marked as the active permit.
 *
 * @param {string} hash - The `PermitV2.getHash` of the target permit.
 */
const selectActivePermit = (hash: string) => {
  const state = _sdkStore.getState();

  if (!state.initialized)
    throw new Error("selectActivePermit :: fhenixsdk not initialized");
  if (state.account == null)
    throw new Error("selectActivePermit :: missing account");

  const permit = getPermitFromStore(state.account, hash);
  if (permit == null) return;

  setActivePermitHash(state.account, permit.getHash());
};

/**
 * Retrieves a stored permit based on its hash.
 * If no hash is provided, the currently active permit will be retrieved.
 *
 * @param {string} hash - Optional `PermitV2.getHash` of the permit.
 * @returns {Result<PermitV2>} - The active permit or permit associated with `hash` as a Result object.
 */
const getPermit = (hash?: string): Result<PermitV2> => {
  const state = _sdkStore.getState();

  if (!state.initialized)
    throw new Error("getPermit :: fhenixsdk not initialized");
  if (state.account == null) throw new Error("getPermit :: missing account");

  if (hash == null) {
    const permit = getActivePermit(state.account);
    if (permit == null)
      return ResultErr(`getPermit :: active permit not found`);

    return ResultOk(permit);
  }

  const permit = getPermitFromStore(state.account, hash);
  if (permit == null)
    return ResultErr(`getPermit :: permit with hash <${hash}> not found`);

  return ResultOk(permit);
};

/**
 * Retrieves a stored permission based on the permit's hash.
 * If no hash is provided, the currently active permit will be used.
 * The `PermissionV2` is extracted from the permit.
 *
 * @param {string} hash - Optional hash of the permission to get, defaults to active permit's permission
 * @returns {Result<PermissionV2>} - The active permission or permission associated with `hash`, as a result object.
 */
const getPermission = (hash?: string): Result<PermissionV2> => {
  const permitResult = getPermit(hash);
  if (!permitResult.success) return permitResult;

  return ResultOk(permitResult.data.getPermission());
};

/**
 * Exports all stored permits.
 * @returns {Result<Record<string, PermitV2>>} - All stored permits.
 */
const getAllPermits = (): Result<Record<string, PermitV2>> => {
  const state = _sdkStore.getState();

  if (!state.initialized)
    throw new Error("getAllPermits :: fhenixsdk not initialized");
  if (state.account == null)
    throw new Error("getAllPermits :: missing account");

  return ResultOk(getPermitsFromStore(state.account));
};

// Encrypt

/**
 * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
 * @param {number} value - The numeric value to encrypt.
 * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
 * @param securityZone - The security zone for which to encrypt the value (default 0).
 * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
 */
const encryptValue = (
  value: number,
  type?: EncryptionTypes,
  securityZone: number = 0,
): EncryptedNumber => {
  const state = _sdkStore.getState();

  if (!state.initialized)
    throw new Error("encryptValue :: fhenixsdk not initialized");
  if (state.chainId == null) throw new Error("encryptValue :: missing chainId");

  const fhePublicKey = _store_getFheKey(state.chainId, securityZone);
  if (fhePublicKey == null)
    throw new Error(
      `encryptValue :: fheKey not found for chain <${state.chainId}> and securityZone <${securityZone}>`,
    );

  let outputSize = type;

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
};

function encrypt<T>(item: T): MappedEncryptedTypes<T>;
function encrypt<T extends any[]>(item: [...T]): [...MappedEncryptedTypes<T>];
function encrypt<T extends any[]>(
  ...item: [...T]
): [...MappedEncryptedTypes<T>];
function encrypt<T>(item: T) {
  // Permission
  if (item === "permission") {
    return getPermission();
  }

  // EncryptableItem
  if (isEncryptableItem(item)) {
    const fhePublicKey = _store_getConnectedChainFheKey(item.securityZone ?? 0);
    if (fhePublicKey == null)
      throw new Error("encrypt :: fheKey for current chain not found");

    // Prevent wrapping taking up too much vertical space
    // prettier-ignore
    {
        switch (item.utype) {
          case FheUType.bool: return tfheEncrypt.encrypt_bool(item.data, fhePublicKey, item.securityZone);
          case FheUType.uint8: return tfheEncrypt.encrypt_uint8(item.data, fhePublicKey, item.securityZone);
          case FheUType.uint16: return tfheEncrypt.encrypt_uint16(item.data, fhePublicKey, item.securityZone);
          case FheUType.uint32: return tfheEncrypt.encrypt_uint32(item.data, fhePublicKey, item.securityZone);
          case FheUType.uint64: return tfheEncrypt.encrypt_uint64(item.data, fhePublicKey, item.securityZone);
          case FheUType.uint128: return tfheEncrypt.encrypt_uint128(item.data, fhePublicKey, item.securityZone);
          case FheUType.uint256: return tfheEncrypt.encrypt_uint256(item.data, fhePublicKey, item.securityZone);
          case FheUType.address: return tfheEncrypt.encrypt_address(item.data, fhePublicKey, item.securityZone);
        }
      }
  }

  // Object | Array
  if (typeof item === "object" && item !== null) {
    if (Array.isArray(item)) {
      // Array - recurse
      return item.map((nestedItem) => encrypt(nestedItem));
    } else {
      // Object - recurse
      const result: any = {};
      for (const key in item) {
        result[key] = encrypt(item[key]);
      }
      return result;
    }
  }

  // Primitive
  return item;
}

// Unseal

/**
 * Unseals an encrypted message using the stored permit for a specific contract address.
 * NOTE: Wrapper around `PermitV2.unseal`
 *
 * @param {string} ciphertext - The encrypted message to unseal.
 * @param {string} account - Users address, defaults to store.account
 * @param {string} hash - The hash of the permit to use for this operation, defaults to active permitV2 hash
 * @returns bigint - The unsealed message.
 */
const unsealCiphertext = (
  ciphertext: string,
  account?: string,
  hash?: string,
): bigint => {
  const state = _sdkStore.getState();

  if (!state.initialized)
    throw new Error("unsealCiphertext :: fhenixsdk not initialized");
  if (state.chainId == null)
    throw new Error("unsealCiphertext :: missing chainId");

  isString(ciphertext);
  const resolvedAccount = account ?? state.account;
  const resolvedHash = hash ?? getActivePermitHash(resolvedAccount);
  if (resolvedAccount == null || resolvedHash == null) {
    throw new Error(`PermitV2 hash not provided and active PermitV2 not found`);
  }

  const permit = getPermitFromStore(resolvedAccount, resolvedHash);
  if (permit == null) {
    throw new Error(
      `PermitV2 with account <${account}> and hash <${hash}> not found`,
    );
  }

  return permit.unsealCiphertext(ciphertext);
};

/**
 * Uses the privateKey of `permit.sealingPair` to recursively unseal any contained `SealedItems`.
 * If `item` is a single `SealedItem` it will be individually.
 * NOTE: Only unseals typed `SealedItem`s returned from `FHE.sealoutputTyped` and the FHE bindings' `e____.sealTyped`.
 *
 * @param {any | any[]} item - Array, object, or item. Any nested `SealedItems` will be unsealed.
 * @returns - Recursively unsealed data in the target type, SealedBool -> boolean, SealedAddress -> string, etc.
 */
function unseal<T>(item: T, account?: string, hash?: string) {
  const resolvedAccount = account ?? _sdkStore.getState().account;
  const resolvedHash = hash ?? getActivePermitHash(resolvedAccount);
  if (resolvedAccount == null || resolvedHash == null) {
    throw new Error(`PermitV2 hash not provided and active PermitV2 not found`);
  }

  const permit = getPermitFromStore(resolvedAccount, resolvedHash);
  if (permit == null) {
    throw new Error(
      `PermitV2 with account <${account}> and hash <${hash}> not found`,
    );
  }

  return permit.unseal(item);
}

// Export

export const fhenixsdk = {
  store: _sdkStore,
  initialize,

  createPermit,
  importPermit,
  selectActivePermit,
  getPermit,
  getPermission,
  getAllPermits,

  encryptValue,
  encrypt,

  unsealCiphertext,
  unseal,
};
