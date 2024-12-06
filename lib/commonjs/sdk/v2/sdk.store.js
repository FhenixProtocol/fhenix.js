"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._store_fetchFheKey = exports._store_initialize = exports._store_setFheKey = exports._store_getConnectedChainFheKey = exports._store_getFheKey = exports._sdkStore = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const vanilla_1 = require("zustand/vanilla");
const immer_1 = require("immer");
const fhe_1 = require("../fhe/fhe");
const utils_1 = require("../utils");
const consts_1 = require("../consts");
exports._sdkStore = (0, vanilla_1.createStore)(() => ({
    fheKeysInitialized: false,
    securityZones: [0],
    fheKeys: {},
    accessRequirements: {
        contracts: [],
        projects: [],
    },
    providerInitialized: false,
    provider: undefined,
    chainId: undefined,
    signerInitialized: false,
    signer: undefined,
    account: undefined,
}));
// Store getters / setters
const _store_getFheKey = (chainId, securityZone) => {
    if (chainId == null || securityZone == null)
        return undefined;
    const serialized = exports._sdkStore.getState().fheKeys[chainId]?.[securityZone];
    if (serialized == null)
        return undefined;
    return fhe_1.TfheCompactPublicKey.deserialize(serialized);
};
exports._store_getFheKey = _store_getFheKey;
const _store_getConnectedChainFheKey = (securityZone) => {
    const state = exports._sdkStore.getState();
    if (securityZone == null)
        return undefined;
    if (state.chainId == null)
        return undefined;
    const serialized = state.fheKeys[state.chainId]?.[securityZone];
    if (serialized == null)
        return undefined;
    return fhe_1.TfheCompactPublicKey.deserialize(serialized);
};
exports._store_getConnectedChainFheKey = _store_getConnectedChainFheKey;
const _store_setFheKey = (chainId, securityZone, fheKey) => {
    if (chainId == null || securityZone == null)
        return;
    exports._sdkStore.setState((0, immer_1.produce)((state) => {
        if (state.fheKeys[chainId] == null)
            state.fheKeys[chainId] = {};
        state.fheKeys[chainId][securityZone] = fheKey?.serialize();
    }));
};
exports._store_setFheKey = _store_setFheKey;
const getChainIdFromProvider = async (provider) => {
    const chainId = await provider.getChainId();
    if (chainId == null)
        throw new Error("sdk :: getChainIdFromProvider :: provider.getChainId returned a null result, ensure that your provider is connected to a network");
    return chainId;
};
const _store_initialize = async (init) => {
    const { provider, signer, securityZones = [0], contracts: contractRequirements = [], projects: projectRequirements = [], } = init;
    exports._sdkStore.setState({
        providerInitialized: false,
        signerInitialized: false,
        accessRequirements: {
            contracts: contractRequirements,
            projects: projectRequirements,
        },
    });
    // PROVIDER
    // Fetch chain Id from provider
    const chainId = await getChainIdFromProvider(provider);
    const chainIdChanged = chainId != null && chainId !== exports._sdkStore.getState().chainId;
    if (chainId != null && provider != null) {
        exports._sdkStore.setState({ providerInitialized: true, provider, chainId });
    }
    // SIGNER
    // Account is fetched and stored here, the `account` field in the store is used to index which permits belong to which users
    // In sdk functions, `state.account != null` is validated, this is a check to ensure that a valid signer has been provided
    //   which is necessary to interact with permits
    const account = await signer?.getAddress();
    if (account != null && signer != null) {
        exports._sdkStore.setState({ signerInitialized: true, account, signer });
    }
    // If chainId or securityZones changes, update the store and update fheKeys for re-initialization
    const securityZonesChanged = securityZones !== exports._sdkStore.getState().securityZones;
    if (chainIdChanged || securityZonesChanged) {
        exports._sdkStore.setState({
            securityZones,
            fheKeysInitialized: false,
        });
    }
    // FHE KEYS
    if (!exports._sdkStore.getState().fheKeysInitialized) {
        await Promise.all(securityZones.map((securityZone) => (0, exports._store_fetchFheKey)(chainId, provider, securityZone)));
    }
    exports._sdkStore.setState({ fheKeysInitialized: true });
};
exports._store_initialize = _store_initialize;
/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {string} chainId - The chain to fetch the FHE key for, if no chainId provided, undefined is returned
 * @param {Provider} provider - EthersV6 Provider that performs the key fetch.
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
const _store_fetchFheKey = async (chainId, provider, securityZone = 0) => {
    const storedKey = (0, exports._store_getFheKey)(chainId, securityZone);
    if (storedKey != null)
        return storedKey;
    const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
    const callData = funcSig + (0, utils_1.toABIEncodedUint32)(securityZone);
    const publicKey = await provider
        .call({ to: consts_1.FheOpsAddress, data: callData })
        .catch((err) => {
        throw Error(`Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(err)}`);
    });
    if (typeof publicKey !== "string") {
        throw new Error("Error using publicKey from provider: expected string");
    }
    if (publicKey.length < consts_1.PUBLIC_KEY_LENGTH_MIN) {
        throw new Error(`Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`);
    }
    // todo (eshel) verify this
    // magically know how to decode rlp or w/e returns from the evm json-rpc
    const buff = (0, utils_1.fromHexString)(publicKey.slice(130));
    try {
        const key = fhe_1.TfheCompactPublicKey.deserialize(buff);
        (0, exports._store_setFheKey)(chainId, securityZone, key);
        return key;
    }
    catch (err) {
        throw new Error(`Error deserializing public key ${err}`);
    }
};
exports._store_fetchFheKey = _store_fetchFheKey;
//# sourceMappingURL=sdk.store.js.map