/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { TfheCompactPublicKey } from "../sdk/fhe/fhe";
import { produce } from "immer";
import {
  PermissionV2,
  PermitV2Interface,
  PermitV2Options,
  SendFn,
  SignTypedDataFn,
} from "./types";
import { InitFhevm } from "../sdk/init";
import {
  FheOpsAddress,
  MAX_UINT16,
  MAX_UINT32,
  MAX_UINT8,
  PUBLIC_KEY_LENGTH_MIN,
} from "../sdk/consts";
import {
  toABIEncodedUint32,
  fromHexString,
  ValidateUintInRange,
} from "../sdk/utils";
import * as tfheEncrypt from "../sdk/encrypt.js";
import { PermitV2 } from "../sdk/permitV2";
import {
  EncryptedNumber,
  EncryptionTypes,
  FheUType,
  isEncryptableItem,
  MappedEncryptedTypes,
  Result,
  ResultErr,
  ResultOk,
} from "../sdk/types";
import {
  getActivePermit,
  getPermits as getPermitsFromStore,
  getPermit as getPermitFromStore,
  setActivePermitHash,
  setPermit,
  getActivePermitHash,
} from "./permitsStore";
import { isString } from "../sdk/validation.js";

type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;

type SdkStore = {
  initialized: boolean;
  fhevmInitialized: boolean;
  fheKeysInitialized: boolean;

  securityZones: number[];
  fheKeys: ChainRecord<SecurityZoneRecord<Uint8Array | undefined>>;

  account?: string;
  chainId?: string;
  send?: SendFn;
  signTypedData?: SignTypedDataFn;
};

export type InitParams = {
  account: string;
  send: SendFn;
  signTypedData: SignTypedDataFn;
  securityZones?: number[];
  ignoreErrors?: boolean;
};

// Stores generated permits for each user, a hash indicating the active permit for each user, and a list of fheKeys as a cache
// Can be used to create reactive hooks
export const fhenixSdkStore = createStore<SdkStore>()(
  persist(
    () => ({
      initialized: false as boolean,
      fhevmInitialized: false as boolean,
      fheKeysInitialized: false as boolean,

      securityZones: [0],
      fheKeys: {},
    }),
    { name: "fhenixsdk" },
  ),
);

const getFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
): TfheCompactPublicKey | undefined => {
  if (chainId == null || securityZone == null) return undefined;

  const serialized = fhenixSdkStore.getState().fheKeys[chainId]?.[securityZone];
  if (serialized == null) return undefined;

  return TfheCompactPublicKey.deserialize(serialized);
};

const getCurrentChainFheKey = (
  securityZone: number | undefined,
): TfheCompactPublicKey | undefined => {
  const state = fhenixSdkStore.getState();

  if (securityZone == null) return undefined;
  if (state.chainId == null) return undefined;

  const serialized = state.fheKeys[state.chainId]?.[securityZone];
  if (serialized == null) return undefined;

  return TfheCompactPublicKey.deserialize(serialized);
};

const setFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
  fheKey: TfheCompactPublicKey | undefined,
) => {
  if (chainId == null || securityZone == null) return;

  fhenixSdkStore.setState(
    produce<SdkStore>((state) => {
      if (state.fheKeys[chainId] == null) state.fheKeys[chainId] = {};
      state.fheKeys[chainId][securityZone] = fheKey?.serialize();
    }),
  );
};

const getChainIdFromProvider = async (send: SendFn): Promise<string> => {
  const chainId = (await send("eth_chainId").catch((err: Error) => {
    throw Error(`Error while requesting chainId from provider: ${err}`);
  })) as string;

  if (isNaN(parseInt(chainId, 16))) {
    throw new Error(
      `received non-hex number from chainId request: "${chainId}"`,
    );
  }

  return chainId;
};

/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {SupportedProvider} provider - The provider from which to retrieve the key.
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
const fetchFheKey = async (
  chainId: string | undefined,
  securityZone: number = 0,
  send: SendFn | undefined,
): Promise<TfheCompactPublicKey> => {
  const storedKey = getFheKey(chainId, securityZone);
  if (storedKey != null) return storedKey;

  const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
  const callData = funcSig + toABIEncodedUint32(securityZone);

  const callParams = [{ to: FheOpsAddress, data: callData }, "latest"];

  const publicKey = await send?.("eth_call", callParams).catch((err: Error) => {
    throw Error(
      `Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(
        err,
      )}`,
    );
  });

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
};

const initialize = async (init: InitParams) => {
  const {
    account,
    send,
    signTypedData,
    ignoreErrors = false,
    securityZones = [0],
  } = init;

  fhenixSdkStore.setState({ initialized: false });

  // FHEVM

  if (!fhenixSdkStore.getState().fhevmInitialized) {
    await InitFhevm().catch((err: unknown) => {
      if (ignoreErrors) {
        return undefined;
      } else {
        throw new Error(
          `Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`,
        );
      }
    });
    fhenixSdkStore.setState({ fhevmInitialized: true });
  }

  // PROVIDER

  if (!account || !send || !signTypedData) {
    throw new Error(
      "Failed to initialize Fhenix Client - must include account, send function, and signTypedData functions",
    );
  }
  fhenixSdkStore.setState({ account, send, signTypedData });

  const chainId = await getChainIdFromProvider(send);

  if (
    chainId !== fhenixSdkStore.getState().chainId ||
    securityZones !== fhenixSdkStore.getState().securityZones
  )
    fhenixSdkStore.setState({ fheKeysInitialized: false });

  fhenixSdkStore.setState({ chainId, securityZones });

  // FHE KEYS

  if (securityZones.length === 0) throw new Error("No securityZones provided");

  await Promise.all(
    securityZones.map((securityZone) =>
      fetchFheKey(chainId, securityZone, send),
    ),
  );

  fhenixSdkStore.setState({ fheKeysInitialized: true, initialized: true });
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
  const state = fhenixSdkStore.getState();

  if (!state.initialized) throw new Error("createPermit :: not initialized");
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
  const state = fhenixSdkStore.getState();

  if (!state.initialized) throw new Error("importPermit :: not initialized");
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
  const state = fhenixSdkStore.getState();

  if (!state.initialized)
    throw new Error("selectActivePermit :: not initialized");
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
  const state = fhenixSdkStore.getState();

  if (!state.initialized) throw new Error("getPermit :: not initialized");
  if (state.account == null) throw new Error("getPermit :: missing account");

  if (hash == null) {
    const permit = getActivePermit(state.account);
    if (permit == null)
      return ResultErr(`getPermit :: active permit not found`);

    return ResultOk(permit);
  }

  const permit = getPermitFromStore(state.account, hash);
  if (permit == null) return ResultErr(`permit with hash <${hash}> not found`);

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
  const state = fhenixSdkStore.getState();

  if (!state.initialized) throw new Error("getAllPermits :: not initialized");
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
  const state = fhenixSdkStore.getState();

  if (!state.initialized) throw new Error("encryptValue :: not initialized");
  if (state.chainId == null) throw new Error("encryptValue :: missing chainId");

  const fhePublicKey = getFheKey(state.chainId, securityZone);
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
    const fhePublicKey = getCurrentChainFheKey(item.securityZone ?? 0);
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
      return item.map((nestedItem) => this.encrypt(nestedItem));
    } else {
      // Object - recurse
      const result: any = {};
      for (const key in item) {
        result[key] = this.encrypt(item[key]);
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
 * @param {string} account - Users address, defaults to this.account
 * @param {string} hash - The hash of the permit to use for this operation, defaults to active permitV2 hash
 * @returns bigint - The unsealed message.
 */
const unsealCiphertext = (
  ciphertext: string,
  account?: string,
  hash?: string,
): bigint => {
  const state = fhenixSdkStore.getState();

  if (!state.initialized)
    throw new Error("unsealCiphertext :: not initialized");
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
  const resolvedAccount = account ?? this.account;
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
  fhenixSdkStore,
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
