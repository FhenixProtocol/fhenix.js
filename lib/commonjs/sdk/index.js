"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fhenixsdk = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const utils_js_1 = require("./utils.js");
const utils_hardhat_js_1 = require("./utils.hardhat.js");
const permit_1 = require("./permit");
const validation_js_1 = require("./validation.js");
const store_js_1 = require("./store.js");
const encrypt_js_1 = require("./encrypt.js");
const init_js_1 = require("./init.js");
const types_1 = require("../types");
/**
 * Initializes the `fhenixsdk` to enable encrypting input data, creating permits / permissions, and decrypting sealed outputs.
 * Initializes `fhevm` client FHE wasm module and fetches the provided chain's FHE publicKey.
 * If a valid signer is provided, a `permit/permission` is generated automatically
 */
const initialize = async (params) => {
    // Initialize the fhevm
    await (0, init_js_1.InitFhevm)().catch((err) => {
        if (params.ignoreErrors) {
            return undefined;
        }
        else {
            return (0, types_1.ResultErr)(`initialize :: failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
        }
    });
    if (params.provider == null)
        return (0, types_1.ResultErr)("initialize :: missing provider - Please provide an AbstractProvider interface");
    if (params.securityZones != null && params.securityZones.length === 0)
        return (0, types_1.ResultErr)("initialize :: a list of securityZones was provided, but it is empty");
    await (0, store_js_1._store_initialize)(params);
    // `generatePermit` must set to `false` to early exit here
    if (params.generatePermit === false)
        return (0, types_1.ResultOk)(undefined);
    // Return the existing active permit
    const userActivePermit = getPermit();
    if (userActivePermit.success)
        return userActivePermit;
    // Create permit and return it
    return createPermit();
};
/**
 * Internal reusable initialization checker
 */
const _checkInitialized = (state, options) => {
    if (options?.fheKeys !== false && !state.fheKeysInitialized) {
        return (0, types_1.ResultErr)("fhenixsdk not initialized. Use `fhenixsdk.initialize(...)`.");
    }
    if (options?.coFheUrl !== false && !state.coFheUrl)
        return (0, types_1.ResultErr)("fhenixsdk not initialized with a coFheUrl. Set `coFheUrl` in `fhenixsdk.initialize`.");
    if (options?.provider !== false && !state.providerInitialized)
        return (0, types_1.ResultErr)("fhenixsdk not initialized with valid provider. Use `fhenixsdk.initialize(...)` with a valid provider that satisfies `AbstractProvider`.");
    if (options?.signer !== false && !state.signerInitialized)
        return (0, types_1.ResultErr)("fhenixsdk not initialized with a valid signer. Use `fhenixsdk.initialize(...)` with a valid signer that satisfies `AbstractSigner`.");
    return (0, types_1.ResultOk)(null);
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
const createPermit = async (options) => {
    const state = store_js_1._sdkStore.getState();
    const initialized = _checkInitialized(state);
    if (!initialized.success)
        return (0, types_1.ResultErr)(`${createPermit.name} :: ${initialized.error}`);
    const optionsWithDefaults = {
        type: "self",
        issuer: state.account,
        contracts: state.accessRequirements.contracts,
        projects: state.accessRequirements.projects,
        ...options,
    };
    let permit;
    try {
        permit = await permit_1.PermitV2.createAndSign(optionsWithDefaults, state.chainId, state.signer);
    }
    catch (e) {
        return (0, types_1.ResultErr)(`${createPermit.name} :: ${e}`);
    }
    permit_1.permitStore.setPermit(state.account, permit);
    permit_1.permitStore.setActivePermitHash(state.account, permit.getHash());
    return (0, types_1.ResultOk)(permit);
};
/**
 * Imports a fully formed existing permit, expected to be valid.
 * Does not ask for user signature, expects to already be populated.
 * Will throw an error if the imported permit is invalid, see `PermitV2.isValid`.
 * The imported PermitV2 will be inserted into the store and marked as the active permit.
 *
 * @param {string | PermitV2Interface} imported - Permit to import as a text string or PermitV2Interface
 */
const importPermit = async (imported) => {
    const state = store_js_1._sdkStore.getState();
    const initialized = _checkInitialized(state);
    if (!initialized.success)
        return (0, types_1.ResultErr)(`${createPermit.name} :: ${initialized.error}`);
    // Import validation
    if (typeof imported === "string") {
        try {
            imported = JSON.parse(imported);
        }
        catch (e) {
            return (0, types_1.ResultErr)(`importPermit :: json parsing failed - ${e}`);
        }
    }
    const { success, data: parsedPermit, error: permitParsingError, } = permit_1.PermitV2ParamsValidator.safeParse(imported);
    if (!success) {
        const errorString = Object.entries(permitParsingError.flatten().fieldErrors)
            .map(([field, err]) => `- ${field}: ${err}`)
            .join("\n");
        return (0, types_1.ResultErr)(`importPermit :: invalid permit data - ${errorString}`);
    }
    if (parsedPermit.type !== "self") {
        if (parsedPermit.issuer === state.account)
            parsedPermit.type = "sharing";
        else if (parsedPermit.recipient === state.account)
            parsedPermit.type = "recipient";
        else {
            return (0, types_1.ResultErr)(`importPermit :: invalid Permit - connected account <${state.account}> is not issuer or recipient`);
        }
    }
    let permit;
    try {
        permit = await permit_1.PermitV2.create(parsedPermit);
    }
    catch (e) {
        return (0, types_1.ResultErr)(`importPermit :: ${e}`);
    }
    const { valid, error } = permit.isValid();
    if (!valid) {
        return (0, types_1.ResultErr)(`importPermit :: newly imported permit is invalid - ${error}`);
    }
    permit_1.permitStore.setPermit(state.account, permit);
    permit_1.permitStore.setActivePermitHash(state.account, permit.getHash());
    return (0, types_1.ResultOk)(permit);
};
/**
 * Selects the active permit using its hash.
 * If the hash is not found in the stored permits store, throws an error.
 * The matched permit will be marked as the active permit.
 *
 * @param {string} hash - The `PermitV2.getHash` of the target permit.
 */
const selectActivePermit = (hash) => {
    const state = store_js_1._sdkStore.getState();
    const initialized = _checkInitialized(state);
    if (!initialized.success)
        return (0, types_1.ResultErr)(`${selectActivePermit.name} :: ${initialized.error}`);
    const permit = permit_1.permitStore.getPermit(state.account, hash);
    if (permit == null)
        return (0, types_1.ResultErr)(`${selectActivePermit.name} :: Permit with hash <${hash}> not found`);
    permit_1.permitStore.setActivePermitHash(state.account, permit.getHash());
    return (0, types_1.ResultOk)(permit);
};
/**
 * Retrieves a stored permit based on its hash.
 * If no hash is provided, the currently active permit will be retrieved.
 *
 * @param {string} hash - Optional `PermitV2.getHash` of the permit.
 * @returns {Result<PermitV2>} - The active permit or permit associated with `hash` as a Result object.
 */
const getPermit = (hash) => {
    const state = store_js_1._sdkStore.getState();
    const initialized = _checkInitialized(state);
    if (!initialized.success)
        return (0, types_1.ResultErr)(`${getPermit.name} :: ${initialized.error}`);
    if (hash == null) {
        const permit = permit_1.permitStore.getActivePermit(state.account);
        if (permit == null)
            return (0, types_1.ResultErr)(`getPermit :: active permit not found`);
        return (0, types_1.ResultOk)(permit);
    }
    const permit = permit_1.permitStore.getPermit(state.account, hash);
    if (permit == null)
        return (0, types_1.ResultErr)(`getPermit :: permit with hash <${hash}> not found`);
    return (0, types_1.ResultOk)(permit);
};
/**
 * Retrieves a stored permission based on the permit's hash.
 * If no hash is provided, the currently active permit will be used.
 * The `PermissionV2` is extracted from the permit.
 *
 * @param {string} hash - Optional hash of the permission to get, defaults to active permit's permission
 * @returns {Result<PermissionV2>} - The active permission or permission associated with `hash`, as a result object.
 */
const getPermission = (hash) => {
    const permitResult = getPermit(hash);
    if (!permitResult.success)
        return (0, types_1.ResultErr)(`${getPermission.name} :: ${permitResult.error}`);
    return (0, types_1.ResultOk)(permitResult.data.getPermission());
};
/**
 * Exports all stored permits.
 * @returns {Result<Record<string, PermitV2>>} - All stored permits.
 */
const getAllPermits = () => {
    const state = store_js_1._sdkStore.getState();
    const initialized = _checkInitialized(state);
    if (!initialized.success)
        return (0, types_1.ResultErr)(`${getAllPermits.name} :: ${initialized.error}`);
    return (0, types_1.ResultOk)(permit_1.permitStore.getPermits(state.account));
};
async function encrypt(item) {
    const state = store_js_1._sdkStore.getState();
    // Only need to check `fheKeysInitialized`, signer and provider not needed for encryption
    const initialized = _checkInitialized(state, {
        provider: false,
        signer: false,
    });
    if (!initialized.success)
        return (0, types_1.ResultErr)(`${encrypt.name} :: ${initialized.error}`);
    // Permission
    if (item === "permission") {
        return getPermission();
    }
    // EncryptableItem
    if ((0, types_1.isEncryptableItem)(item)) {
        // Early exit with mock encrypted value if chain is hardhat
        // TODO: Determine how CoFHE encrypted items will be handled in hardhat
        if ((0, utils_hardhat_js_1.chainIsHardhat)(state.coFheUrl))
            return (0, types_1.ResultOk)((0, utils_hardhat_js_1.hardhatMockEncrypt)(BigInt(item.data)));
        const fhePublicKey = (0, store_js_1._store_getConnectedChainFheKey)(item.securityZone ?? 0);
        if (fhePublicKey == null)
            return (0, types_1.ResultErr)("encrypt :: fheKey for current chain not found");
        let preEncryptedItem;
        // prettier-ignore
        try {
            switch (item.utype) {
                case types_1.FheUType.bool: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_bool)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
                case types_1.FheUType.uint8: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_uint8)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
                case types_1.FheUType.uint16: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_uint16)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
                case types_1.FheUType.uint32: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_uint32)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
                case types_1.FheUType.uint64: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_uint64)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
                case types_1.FheUType.uint128: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_uint128)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
                case types_1.FheUType.uint256: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_uint256)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
                case types_1.FheUType.address: {
                    preEncryptedItem = (0, encrypt_js_1.encrypt_address)(item.data, fhePublicKey, item.securityZone);
                    break;
                }
            }
        }
        catch (e) {
            return (0, types_1.ResultErr)(`encrypt :: tfhe_encrypt_xxxx :: ${e}`);
        }
        console.log({ preEncryptedItem, item });
        // Send preEncryptedItem to CoFHE route `/UpdateCT`, receive `ctHash` to use as contract input
        const res = (await fetch(`${state.coFheUrl}/UpdateCT`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure the server knows you're sending JSON
            },
            body: JSON.stringify({
                UType: item.utype,
                Value: (0, utils_js_1.toHexString)(preEncryptedItem.data),
                SecurityZone: item.securityZone,
            }),
        }));
        const data = await res.json();
        // Transform data into final CoFHE input variable
        return {
            securityZone: item.securityZone,
            hash: BigInt(`0x${data.ctHash}`),
            utype: item.utype,
            signature: data.signature,
        };
    }
    // Object | Array
    if (typeof item === "object" && item !== null) {
        if (Array.isArray(item)) {
            // Array - recurse
            const nestedItems = await Promise.all(item.map((nestedItem) => encrypt(nestedItem)));
            // Any nested error break out
            const nestedItemResultErr = nestedItems.find((nestedItem) => !nestedItem.success);
            if (nestedItemResultErr != null)
                return nestedItemResultErr;
            return (0, types_1.ResultOk)(nestedItems.map((nestedItem) => nestedItem.data));
        }
        else {
            // Object - recurse
            const nestedKeyedItems = await Promise.all(Object.entries(item).map(async ([key, value]) => ({
                key,
                value: await encrypt(value),
            })));
            // Any nested error break out
            const nestedItemResultErr = nestedKeyedItems.find(({ value }) => !value.success);
            if (nestedItemResultErr != null)
                return nestedItemResultErr;
            const result = {};
            nestedKeyedItems.forEach(({ key, value }) => {
                result[key] = value.data;
            });
            return (0, types_1.ResultOk)(result);
        }
    }
    // Primitive
    return (0, types_1.ResultOk)(item);
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
const unsealCiphertext = (ciphertext, account, hash) => {
    const state = store_js_1._sdkStore.getState();
    const initialized = _checkInitialized(state);
    if (!initialized.success)
        return (0, types_1.ResultErr)(`${getAllPermits.name} :: ${initialized.error}`);
    (0, validation_js_1.isString)(ciphertext);
    const resolvedAccount = account ?? state.account;
    const resolvedHash = hash ?? permit_1.permitStore.getActivePermitHash(resolvedAccount);
    if (resolvedAccount == null || resolvedHash == null) {
        return (0, types_1.ResultErr)(`unsealCiphertext :: PermitV2 hash not provided and active PermitV2 not found`);
    }
    const permit = permit_1.permitStore.getPermit(resolvedAccount, resolvedHash);
    if (permit == null) {
        return (0, types_1.ResultErr)(`unsealCiphertext :: PermitV2 with account <${account}> and hash <${hash}> not found`);
    }
    let unsealed;
    try {
        unsealed = permit.unsealCiphertext(ciphertext);
    }
    catch (e) {
        return (0, types_1.ResultErr)(`unsealCiphertext :: ${e}`);
    }
    return (0, types_1.ResultOk)(unsealed);
};
/**
 * Uses the privateKey of `permit.sealingPair` to recursively unseal any contained `SealedItems`.
 * If `item` is a single `SealedItem` it will be individually.
 * NOTE: Only unseals typed `SealedItem`s returned from `FHE.sealoutputTyped` and the FHE bindings' `e____.sealTyped`.
 *
 * @param {any | any[]} item - Array, object, or item. Any nested `SealedItems` will be unsealed.
 * @returns - Recursively unsealed data in the target type, SealedBool -> boolean, SealedAddress -> string, etc.
 */
function unseal(item, account, hash) {
    const resolvedAccount = account ?? store_js_1._sdkStore.getState().account;
    const resolvedHash = hash ?? permit_1.permitStore.getActivePermitHash(resolvedAccount);
    if (resolvedAccount == null || resolvedHash == null) {
        return (0, types_1.ResultErr)(`unseal :: PermitV2 hash not provided and active PermitV2 not found`);
    }
    const permit = permit_1.permitStore.getPermit(resolvedAccount, resolvedHash);
    if (permit == null) {
        return (0, types_1.ResultErr)(`unseal :: PermitV2 with account <${account}> and hash <${hash}> not found`);
    }
    let unsealed;
    try {
        unsealed = permit.unseal(item);
    }
    catch (e) {
        return (0, types_1.ResultErr)(`unseal :: ${e}`);
    }
    return (0, types_1.ResultOk)(unsealed);
}
// Export
exports.fhenixsdk = {
    store: store_js_1._sdkStore,
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
//# sourceMappingURL=index.js.map