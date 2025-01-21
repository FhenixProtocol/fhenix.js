/* eslint-disable @typescript-eslint/no-explicit-any */
import { chainIsHardhat, hardhatMockEncrypt, toHexString } from "./utils.js";
import { PermitV2 } from "./permit/permit.js";
import { permitStore } from "./permit/store.js";
import { isString } from "./validation.js";
import {
  _sdkStore,
  _store_chainId,
  _store_getConnectedChainFheKey,
  _store_initialize,
  InitParams,
  SdkStore,
} from "./store.js";
import {
  encrypt_bool as tfhe_encrypt_bool,
  encrypt_uint8 as tfhe_encrypt_uint8,
  encrypt_uint16 as tfhe_encrypt_uint16,
  encrypt_uint32 as tfhe_encrypt_uint32,
  encrypt_uint64 as tfhe_encrypt_uint64,
  encrypt_uint128 as tfhe_encrypt_uint128,
  encrypt_uint256 as tfhe_encrypt_uint256,
  encrypt_address as tfhe_encrypt_address,
} from "./encrypt.js";
import { InitFhevm } from "./init.js";
import { PermitV2ParamsValidator } from "./permit/permit.z.js";
import { CoFheEncryptedNumber, FheUType } from "../types/types.js";
import {
  MappedCoFheEncryptedTypes,
  isEncryptableItem,
} from "../types/encryptable.js";
import {
  PermitV2Options,
  PermitV2Interface,
  PermissionV2,
} from "../types/permit.js";
import { Result, ResultErr, ResultOk } from "../types/result.js";
import { MappedUnsealedTypes } from "../types/sealed.js";

/**
 * Initializes the `fhenixsdk` to enable encrypting input data, creating permits / permissions, and decrypting sealed outputs.
 * Initializes `fhevm` client FHE wasm module and fetches the provided chain's FHE publicKey.
 * If a valid signer is provided, a `permit/permission` is generated automatically
 */
const initialize = async (
  params: InitParams & { ignoreErrors?: boolean; generatePermit?: boolean },
): Promise<Result<PermitV2 | undefined>> => {
  // Initialize the fhevm
  await InitFhevm().catch((err: unknown) => {
    if (params.ignoreErrors) {
      return undefined;
    } else {
      return ResultErr(
        `initialize :: failed to initialize fhenixjs - is the network FHE-enabled? ${err}`,
      );
    }
  });

  if (params.provider == null)
    return ResultErr(
      "initialize :: missing provider - Please provide an AbstractProvider interface",
    );

  if (params.securityZones != null && params.securityZones.length === 0)
    return ResultErr(
      "initialize :: a list of securityZones was provided, but it is empty",
    );

  await _store_initialize(params);

  // `generatePermit` must set to `false` to early exit here
  if (params.generatePermit === false) return ResultOk(undefined);

  // Return the existing active permit
  const userActivePermit = getPermit();
  if (userActivePermit.success) return userActivePermit;

  // Create permit and return it
  return createPermit();
};

/**
 * Internal reusable initialization checker
 */
const _checkInitialized = (
  state: SdkStore,
  options?: { fheKeys?: boolean; provider?: boolean; signer?: boolean },
) => {
  if (options?.fheKeys !== false && !state.fheKeysInitialized) {
    return ResultErr(
      "fhenixsdk not initialized. Use `fhenixsdk.initialize(...)`.",
    );
  }

  if (options?.provider !== false && !state.providerInitialized)
    return ResultErr(
      "fhenixsdk not initialized with valid provider. Use `fhenixsdk.initialize(...)` with a valid provider that satisfies `AbstractProvider`.",
    );

  if (options?.signer !== false && !state.signerInitialized)
    return ResultErr(
      "fhenixsdk not initialized with a valid signer. Use `fhenixsdk.initialize(...)` with a valid signer that satisfies `AbstractSigner`.",
    );

  return ResultOk(null);
};

// Permit

/**
 * Creates a new permit with options, prompts user for signature.
 * Handles all `permit.type`s, and prompts for the correct signature type.
 * The created PermitV2 will be inserted into the store and marked as the active permit.
 * NOTE: This is a wrapper around `PermitV2.create` and `PermitV2.sign`
 *
 * @param {PermitV2Options} options - Partial PermitV2 fields to create the Permit with, if no options provided will be filled with the defaults:
 * { type: "self", issuer: initializedUserAddress, projects: initializedProjects, contracts: initializedContracts }
 * @returns {Result<PermitV2>} - Newly created PermitV2 as a Result object
 */
const createPermit = async (
  options?: PermitV2Options,
): Promise<Result<PermitV2>> => {
  const state = _sdkStore.getState();

  const initialized = _checkInitialized(state);
  if (!initialized.success)
    return ResultErr(`${createPermit.name} :: ${initialized.error}`);

  const optionsWithDefaults: PermitV2Options = {
    type: "self",
    issuer: state.account,
    contracts: state.accessRequirements.contracts,
    projects: state.accessRequirements.projects,
    ...options,
  };

  let permit: PermitV2;
  try {
    permit = await PermitV2.createAndSign(
      optionsWithDefaults,
      state.chainId,
      state.signer,
    );
  } catch (e) {
    return ResultErr(`${createPermit.name} :: ${e}`);
  }

  permitStore.setPermit(state.account!, permit);
  permitStore.setActivePermitHash(state.account!, permit.getHash());

  return ResultOk(permit);
};

/**
 * Imports a fully formed existing permit, expected to be valid.
 * Does not ask for user signature, expects to already be populated.
 * Will throw an error if the imported permit is invalid, see `PermitV2.isValid`.
 * The imported PermitV2 will be inserted into the store and marked as the active permit.
 *
 * @param {string | PermitV2Interface} imported - Permit to import as a text string or PermitV2Interface
 */
const importPermit = async (
  imported: string | PermitV2Interface,
): Promise<Result<PermitV2>> => {
  const state = _sdkStore.getState();

  const initialized = _checkInitialized(state);
  if (!initialized.success)
    return ResultErr(`${createPermit.name} :: ${initialized.error}`);

  // Import validation
  if (typeof imported === "string") {
    try {
      imported = JSON.parse(imported);
    } catch (e) {
      return ResultErr(`importPermit :: json parsing failed - ${e}`);
    }
  }

  const {
    success,
    data: parsedPermit,
    error: permitParsingError,
  } = PermitV2ParamsValidator.safeParse(imported as PermitV2Interface);
  if (!success) {
    const errorString = Object.entries(permitParsingError.flatten().fieldErrors)
      .map(([field, err]) => `- ${field}: ${err}`)
      .join("\n");
    return ResultErr(`importPermit :: invalid permit data - ${errorString}`);
  }
  if (parsedPermit.type !== "self") {
    if (parsedPermit.issuer === state.account) parsedPermit.type = "sharing";
    else if (parsedPermit.recipient === state.account)
      parsedPermit.type = "recipient";
    else {
      return ResultErr(
        `importPermit :: invalid Permit - connected account <${state.account}> is not issuer or recipient`,
      );
    }
  }

  let permit: PermitV2;
  try {
    permit = await PermitV2.create(parsedPermit as PermitV2Interface);
  } catch (e) {
    return ResultErr(`importPermit :: ${e}`);
  }

  const { valid, error } = permit.isValid();
  if (!valid) {
    return ResultErr(
      `importPermit :: newly imported permit is invalid - ${error}`,
    );
  }

  permitStore.setPermit(state.account!, permit);
  permitStore.setActivePermitHash(state.account!, permit.getHash());

  return ResultOk(permit);
};

/**
 * Selects the active permit using its hash.
 * If the hash is not found in the stored permits store, throws an error.
 * The matched permit will be marked as the active permit.
 *
 * @param {string} hash - The `PermitV2.getHash` of the target permit.
 */
const selectActivePermit = (hash: string): Result<PermitV2> => {
  const state = _sdkStore.getState();

  const initialized = _checkInitialized(state);
  if (!initialized.success)
    return ResultErr(`${selectActivePermit.name} :: ${initialized.error}`);

  const permit = permitStore.getPermit(state.account, hash);
  if (permit == null)
    return ResultErr(
      `${selectActivePermit.name} :: Permit with hash <${hash}> not found`,
    );

  permitStore.setActivePermitHash(state.account!, permit.getHash());

  return ResultOk(permit);
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

  const initialized = _checkInitialized(state);
  if (!initialized.success)
    return ResultErr(`${getPermit.name} :: ${initialized.error}`);

  if (hash == null) {
    const permit = permitStore.getActivePermit(state.account);
    if (permit == null)
      return ResultErr(`getPermit :: active permit not found`);

    return ResultOk(permit);
  }

  const permit = permitStore.getPermit(state.account, hash);
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
  if (!permitResult.success)
    return ResultErr(`${getPermission.name} :: ${permitResult.error}`);

  return ResultOk(permitResult.data.getPermission());
};

/**
 * Exports all stored permits.
 * @returns {Result<Record<string, PermitV2>>} - All stored permits.
 */
const getAllPermits = (): Result<Record<string, PermitV2>> => {
  const state = _sdkStore.getState();

  const initialized = _checkInitialized(state);
  if (!initialized.success)
    return ResultErr(`${getAllPermits.name} :: ${initialized.error}`);

  return ResultOk(permitStore.getPermits(state.account));
};

// Encrypt

/**
 * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
 * Useful when not using `Encryptable` utility structures.
 * @param {item} value - The numeric value to encrypt.
 * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
 * @param securityZone - The security zone for which to encrypt the value (default 0).
 * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
 */
async function encrypt<T>(
  item: T,
): Promise<Result<MappedCoFheEncryptedTypes<T>>>;
async function encrypt<T extends any[]>(
  item: [...T],
): Promise<Result<[...MappedCoFheEncryptedTypes<T>]>>;
async function encrypt<T>(item: T) {
  const state = _sdkStore.getState();
  if (!state.coFhe.enabled)
    return ResultErr(
      "coFheEncrypt :: fhenixsdk not initialized to interact with CoFHE. Set `isCoFHE: true` in `fhenixsdk.initialize`.",
    );

  // Only need to check `fheKeysInitialized`, signer and provider not needed for encryption
  const initialized = _checkInitialized(state, {
    provider: false,
    signer: false,
  });
  if (!initialized.success)
    return ResultErr(`${encrypt.name} :: ${initialized.error}`);

  // Permission
  if (item === "permission") {
    return getPermission();
  }

  // EncryptableItem
  if (isEncryptableItem(item)) {
    // Early exit with mock encrypted value if chain is hardhat
    // TODO: Determine how CoFHE encrypted items will be handled in hardhat
    if (chainIsHardhat(_store_chainId()))
      return ResultOk(hardhatMockEncrypt(BigInt(item.data)));

    const fhePublicKey = _store_getConnectedChainFheKey(item.securityZone ?? 0);
    if (fhePublicKey == null)
      return ResultErr("coFheEncrypt :: fheKey for current chain not found");

    let preEncryptedItem;

    // prettier-ignore
    try {
      switch (item.utype) {
        case FheUType.bool: {
          preEncryptedItem = tfhe_encrypt_bool(item.data, fhePublicKey, item.securityZone);
          break;
        }
        case FheUType.uint8: {
          preEncryptedItem = tfhe_encrypt_uint8(item.data, fhePublicKey, item.securityZone);
          break;
        }
        case FheUType.uint16: {
          preEncryptedItem = tfhe_encrypt_uint16(item.data, fhePublicKey, item.securityZone);
          break;
        }
        case FheUType.uint32: {
          preEncryptedItem = tfhe_encrypt_uint32(item.data, fhePublicKey, item.securityZone);
          break;
        }
        case FheUType.uint64: {
          preEncryptedItem = tfhe_encrypt_uint64(item.data, fhePublicKey, item.securityZone);
          break;
        }
        case FheUType.uint128: {
          preEncryptedItem = tfhe_encrypt_uint128(item.data, fhePublicKey, item.securityZone);
          break;
        }
        case FheUType.uint256: {
          preEncryptedItem = tfhe_encrypt_uint256(item.data, fhePublicKey, item.securityZone);
          break;
        }
        case FheUType.address: {
          preEncryptedItem = tfhe_encrypt_address(item.data, fhePublicKey, item.securityZone);
          break;
        }
      }
    } catch (e) {
      return ResultErr(`coFheEncrypt :: tfhe_encrypt_xxxx :: ${e}`)
    }

    // Send preEncryptedItem to CoFHE route `/UpdateCT`, receive `ctHash` to use as contract input
    const res = (await fetch(`${state.coFhe.url}/UpdateCT`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure the server knows you're sending JSON
      },
      body: JSON.stringify({
        UType: item.utype,
        Value: toHexString(preEncryptedItem.data),
        SecurityZone: item.securityZone,
      }),
    })) as any;

    const data = await res.json();

    // Transform data into final CoFHE input variable
    return {
      securityZone: item.securityZone,
      hash: BigInt(`0x${data.ctHash}`),
      utype: item.utype,
      signature: data.signature,
    } as CoFheEncryptedNumber;
  }

  // Object | Array
  if (typeof item === "object" && item !== null) {
    if (Array.isArray(item)) {
      // Array - recurse
      const nestedItems = await Promise.all(
        item.map((nestedItem) => encrypt(nestedItem)),
      );

      // Any nested error break out
      const nestedItemResultErr = nestedItems.find(
        (nestedItem) => !nestedItem.success,
      );
      if (nestedItemResultErr != null) return nestedItemResultErr;

      return ResultOk(nestedItems.map((nestedItem) => nestedItem.data));
    } else {
      // Object - recurse
      const nestedKeyedItems = await Promise.all(
        Object.entries(item).map(async ([key, value]) => ({
          key,
          value: await encrypt(value),
        })),
      );

      // Any nested error break out
      const nestedItemResultErr = nestedKeyedItems.find(
        ({ value }) => !value.success,
      );
      if (nestedItemResultErr != null) return nestedItemResultErr;

      const result: Record<string, any> = {};
      nestedKeyedItems.forEach(({ key, value }) => {
        result[key] = value.data;
      });

      return ResultOk(result);
    }
  }

  // Primitive
  return ResultOk(item);
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
): Result<bigint> => {
  const state = _sdkStore.getState();

  const initialized = _checkInitialized(state);
  if (!initialized.success)
    return ResultErr(`${getAllPermits.name} :: ${initialized.error}`);

  isString(ciphertext);
  const resolvedAccount = account ?? state.account;
  const resolvedHash = hash ?? permitStore.getActivePermitHash(resolvedAccount);
  if (resolvedAccount == null || resolvedHash == null) {
    return ResultErr(
      `unsealCiphertext :: PermitV2 hash not provided and active PermitV2 not found`,
    );
  }

  const permit = permitStore.getPermit(resolvedAccount, resolvedHash);
  if (permit == null) {
    return ResultErr(
      `unsealCiphertext :: PermitV2 with account <${account}> and hash <${hash}> not found`,
    );
  }

  let unsealed: bigint;
  try {
    unsealed = permit.unsealCiphertext(ciphertext);
  } catch (e) {
    return ResultErr(`unsealCiphertext :: ${e}`);
  }

  return ResultOk(unsealed);
};

/**
 * Uses the privateKey of `permit.sealingPair` to recursively unseal any contained `SealedItems`.
 * If `item` is a single `SealedItem` it will be individually.
 * NOTE: Only unseals typed `SealedItem`s returned from `FHE.sealoutputTyped` and the FHE bindings' `e____.sealTyped`.
 *
 * @param {any | any[]} item - Array, object, or item. Any nested `SealedItems` will be unsealed.
 * @returns - Recursively unsealed data in the target type, SealedBool -> boolean, SealedAddress -> string, etc.
 */
function unseal<T>(
  item: T,
  account?: string,
  hash?: string,
): Result<MappedUnsealedTypes<T>> {
  const resolvedAccount = account ?? _sdkStore.getState().account;
  const resolvedHash = hash ?? permitStore.getActivePermitHash(resolvedAccount);
  if (resolvedAccount == null || resolvedHash == null) {
    return ResultErr(
      `unseal :: PermitV2 hash not provided and active PermitV2 not found`,
    );
  }

  const permit = permitStore.getPermit(resolvedAccount, resolvedHash);
  if (permit == null) {
    return ResultErr(
      `unseal :: PermitV2 with account <${account}> and hash <${hash}> not found`,
    );
  }

  let unsealed: MappedUnsealedTypes<T>;
  try {
    unsealed = permit.unseal(item);
  } catch (e) {
    return ResultErr(`unseal :: ${e}`);
  }

  return ResultOk(unsealed);
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

  encrypt,

  unsealCiphertext,
  unseal,
};
