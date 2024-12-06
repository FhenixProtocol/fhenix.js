import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { PermitV2 } from "./permit";
// Stores generated permits for each user, a hash indicating the active permit for each user, and a list of fheKeys as a cache
// Can be used to create reactive hooks
export const _permitStore = createStore()(persist(() => ({
    permits: {},
    activePermitHash: {},
}), { name: "fhenixjs-permits" }));
// Permit V2
export const getPermit = (account, hash) => {
    if (account == null || hash == null)
        return;
    const savedPermit = _permitStore.getState().permits[account]?.[hash];
    if (savedPermit == null)
        return;
    return PermitV2.deserialize(savedPermit);
};
export const getActivePermit = (account) => {
    if (account == null)
        return;
    const activePermitHash = _permitStore.getState().activePermitHash[account];
    return getPermit(account, activePermitHash);
};
export const getPermits = (account) => {
    if (account == null)
        return {};
    return Object.entries(_permitStore.getState().permits[account] ?? {}).reduce((acc, [hash, permit]) => {
        if (permit == undefined)
            return acc;
        return { ...acc, [hash]: PermitV2.deserialize(permit) };
    }, {});
};
export const setPermit = (account, permitV2) => {
    _permitStore.setState(produce((state) => {
        if (state.permits[account] == null)
            state.permits[account] = {};
        state.permits[account][permitV2.getHash()] = permitV2.serialize();
    }));
};
export const removePermit = (account, hash) => {
    _permitStore.setState(produce((state) => {
        state.permits[account][hash] = undefined;
    }));
};
// Active Permit Hash
export const getActivePermitHash = (account) => {
    if (account == null)
        return undefined;
    return _permitStore.getState().activePermitHash[account];
};
export const setActivePermitHash = (account, hash) => {
    _permitStore.setState(produce((state) => {
        state.activePermitHash[account] = hash;
    }));
};
export const removeActivePermitHash = (account) => {
    _permitStore.setState(produce((state) => {
        state.activePermitHash[account] = undefined;
    }));
};
export const permitStore = {
    store: _permitStore,
    getPermit,
    getActivePermit,
    getPermits,
    setPermit,
    removePermit,
    getActivePermitHash,
    setActivePermitHash,
    removeActivePermitHash,
};
//# sourceMappingURL=permit.store.js.map