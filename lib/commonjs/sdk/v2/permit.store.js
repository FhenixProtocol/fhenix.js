"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permitStore = exports.removeActivePermitHash = exports.setActivePermitHash = exports.getActivePermitHash = exports.removePermit = exports.setPermit = exports.getPermits = exports.getActivePermit = exports.getPermit = exports._permitStore = void 0;
const vanilla_1 = require("zustand/vanilla");
const middleware_1 = require("zustand/middleware");
const immer_1 = require("immer");
const permit_1 = require("./permit");
// Stores generated permits for each user, a hash indicating the active permit for each user, and a list of fheKeys as a cache
// Can be used to create reactive hooks
exports._permitStore = (0, vanilla_1.createStore)()((0, middleware_1.persist)(() => ({
    permits: {},
    activePermitHash: {},
}), { name: "fhenixjs-permits" }));
// Permit V2
const getPermit = (account, hash) => {
    if (account == null || hash == null)
        return;
    const savedPermit = exports._permitStore.getState().permits[account]?.[hash];
    if (savedPermit == null)
        return;
    return permit_1.PermitV2.deserialize(savedPermit);
};
exports.getPermit = getPermit;
const getActivePermit = (account) => {
    if (account == null)
        return;
    const activePermitHash = exports._permitStore.getState().activePermitHash[account];
    return (0, exports.getPermit)(account, activePermitHash);
};
exports.getActivePermit = getActivePermit;
const getPermits = (account) => {
    if (account == null)
        return {};
    return Object.entries(exports._permitStore.getState().permits[account] ?? {}).reduce((acc, [hash, permit]) => {
        if (permit == undefined)
            return acc;
        return { ...acc, [hash]: permit_1.PermitV2.deserialize(permit) };
    }, {});
};
exports.getPermits = getPermits;
const setPermit = (account, permitV2) => {
    exports._permitStore.setState((0, immer_1.produce)((state) => {
        if (state.permits[account] == null)
            state.permits[account] = {};
        state.permits[account][permitV2.getHash()] = permitV2.serialize();
    }));
};
exports.setPermit = setPermit;
const removePermit = (account, hash) => {
    exports._permitStore.setState((0, immer_1.produce)((state) => {
        state.permits[account][hash] = undefined;
    }));
};
exports.removePermit = removePermit;
// Active Permit Hash
const getActivePermitHash = (account) => {
    if (account == null)
        return undefined;
    return exports._permitStore.getState().activePermitHash[account];
};
exports.getActivePermitHash = getActivePermitHash;
const setActivePermitHash = (account, hash) => {
    exports._permitStore.setState((0, immer_1.produce)((state) => {
        state.activePermitHash[account] = hash;
    }));
};
exports.setActivePermitHash = setActivePermitHash;
const removeActivePermitHash = (account) => {
    exports._permitStore.setState((0, immer_1.produce)((state) => {
        state.activePermitHash[account] = undefined;
    }));
};
exports.removeActivePermitHash = removeActivePermitHash;
exports.permitStore = {
    store: exports._permitStore,
    getPermit: exports.getPermit,
    getActivePermit: exports.getActivePermit,
    getPermits: exports.getPermits,
    setPermit: exports.setPermit,
    removePermit: exports.removePermit,
    getActivePermitHash: exports.getActivePermitHash,
    setActivePermitHash: exports.setActivePermitHash,
    removeActivePermitHash: exports.removeActivePermitHash,
};
//# sourceMappingURL=permit.store.js.map