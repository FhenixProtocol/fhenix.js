"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._store_fetchFheKey = exports._store_initialize = exports._store_setFheKey = exports._store_getConnectedChainFheKey = exports._sdkStore = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const vanilla_1 = require("zustand/vanilla");
const immer_1 = require("immer");
const fhe_1 = require("./fhe/fhe");
const utils_1 = require("./utils");
const utils_hardhat_1 = require("./utils.hardhat");
const consts_1 = require("./consts");
exports._sdkStore = (0, vanilla_1.createStore)(() => ({
    fheKeysInitialized: false,
    securityZones: [0],
    fheKeys: {},
    accessRequirements: {
        contracts: [],
        projects: [],
    },
    coFheUrl: undefined,
    providerInitialized: false,
    provider: undefined,
    chainId: undefined,
    signerInitialized: false,
    signer: undefined,
    account: undefined,
}));
// Store getters / setters
const _store_getFheKey = (chainId, securityZone = 0) => {
    if (chainId == null || securityZone == null)
        return undefined;
    const serialized = exports._sdkStore.getState().fheKeys[chainId]?.[securityZone];
    if (serialized == null)
        return undefined;
    return fhe_1.TfheCompactPublicKey.deserialize(serialized);
};
const _store_getConnectedChainFheKey = (securityZone = 0) => {
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
    var chainId = null;
    try {
        chainId = await provider.getChainId();
    }
    catch (err) {
        const network = await provider.getNetwork();
        chainId = network.chainId;
    }
    if (chainId == null)
        throw new Error("sdk :: getChainIdFromProvider :: provider.getChainId returned a null result, ensure that your provider is connected to a network");
    return chainId;
};
// External functionality
const _store_initialize = async (params) => {
    console.log("TTT 1");
    const { provider, signer, securityZones = [0], contracts: contractRequirements = [], projects: projectRequirements = [], coFheUrl = undefined, } = params;
    console.log("TTT 2");
    console.log(params);
    console.log("TTT 2");
    exports._sdkStore.setState({
        providerInitialized: false,
        signerInitialized: false,
        accessRequirements: {
            contracts: contractRequirements,
            projects: projectRequirements,
        },
        coFheUrl,
    });
    // PROVIDER
    // Fetch chain Id from provider
    console.log("TTT 3");
    const chainId = await getChainIdFromProvider(provider);
    console.log("TTT 4");
    const chainIdChanged = chainId != null && chainId !== exports._sdkStore.getState().chainId;
    if (chainId != null && provider != null) {
        exports._sdkStore.setState({ providerInitialized: true, provider, chainId });
    }
    console.log("TTT 5");
    // SIGNER
    // Account is fetched and stored here, the `account` field in the store is used to index which permits belong to which users
    // In sdk functions, `state.account != null` is validated, this is a check to ensure that a valid signer has been provided
    //   which is necessary to interact with permits
    const account = await signer?.getAddress();
    if (account != null && signer != null) {
        exports._sdkStore.setState({ signerInitialized: true, account, signer });
    }
    else {
        exports._sdkStore.setState({
            signerInitialized: false,
            account: undefined,
            signer: undefined,
        });
    }
    console.log("TTT 6");
    // If chainId, securityZones, or CoFhe enabled changes, update the store and update fheKeys for re-initialization
    const securityZonesChanged = securityZones !== exports._sdkStore.getState().securityZones;
    if (chainIdChanged || securityZonesChanged) {
        exports._sdkStore.setState({
            securityZones,
            fheKeysInitialized: false,
        });
    }
    console.log("TTT 7");
    // Fetch FHE keys (skipped if hardhat)
    if (!(0, utils_hardhat_1.chainIsHardhat)(chainId) && !exports._sdkStore.getState().fheKeysInitialized) {
        console.log("TTT 8");
        await Promise.all(securityZones.map((securityZone) => (0, exports._store_fetchFheKey)(chainId, securityZone, true)));
    }
    exports._sdkStore.setState({ fheKeysInitialized: true });
};
exports._store_initialize = _store_initialize;
/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {string} chainId - The chain to fetch the FHE key for, if no chainId provided, undefined is returned
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
const _store_fetchFheKey = async (chainId, securityZone = 0, forceFetch = false) => {
    console.log("TTT 9");
    console.log("chainId", chainId);
    console.log("securityZone", securityZone);
    console.log("TTT 9");
    const storedKey = _store_getFheKey(chainId, securityZone);
    console.log("TTT 10");
    console.log(storedKey);
    console.log("TTT 10");
    if (storedKey != null && !forceFetch)
        return storedKey;
    const coFheUrl = exports._sdkStore.getState().coFheUrl;
    if (coFheUrl == null || typeof coFheUrl !== "string") {
        throw new Error("Error initializing cofhejs; coFheUrl invalid, ensure it is set in `fhenixsdk.initialize`");
    }
    let publicKey = undefined;
    // Fetch publicKey from CoFhe
    try {
        // TODO: misspelling?
        const res = await fetch(`${coFheUrl}/GetNetworkPublickKey`, {
            method: "POST",
            body: JSON.stringify({
                SecurityZone: securityZone,
            }),
        });
        const data = await res.json();
        publicKey = `0x${data.securityZone}`;
        console.log("TTT 11");
        console.log(publicKey);
        console.log("TTT 11");
    }
    catch (err) {
        console.error(err);
        throw new Error(`Error initializing cofhejs; fetching FHE publicKey from CoFHE failed with error ${err}`);
    }
    if (publicKey == null || typeof publicKey !== "string") {
        throw new Error(`Error initializing cofhejs; FHE publicKey fetched from CoFHE invalid: not a string`);
    }
    if (publicKey === "0x") {
        throw new Error("Error initializing cofhejs; provided chain is not FHE enabled, no FHE publicKey found");
    }
    if (publicKey.length < consts_1.PUBLIC_KEY_LENGTH_MIN) {
        throw new Error(`Error initializing cofhejs; got shorter than expected FHE publicKey: ${publicKey.length}. Expected length >= ${consts_1.PUBLIC_KEY_LENGTH_MIN}`);
    }
    const buff = (0, utils_1.fromHexString)(publicKey);
    console.log("TTT 12");
    console.log(buff);
    console.log("TTT 12");
    try {
        console.log("TTT 13");
        console.log(fhe_1.TfheCompactPublicKey);
        console.log("TTT 13");
        const key = fhe_1.TfheCompactPublicKey.deserialize(buff);
        console.log("TTT 14");
        (0, exports._store_setFheKey)(chainId, securityZone, key);
        return key;
    }
    catch (err) {
        throw new Error(`Error deserializing public key ${err}`);
    }
};
exports._store_fetchFheKey = _store_fetchFheKey;
//# sourceMappingURL=store.js.map