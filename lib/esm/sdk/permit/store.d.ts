import { SerializedPermitV2 } from "../../types";
import { PermitV2 } from "./permit";
type AccountRecord<T> = Record<string, T>;
type HashRecord<T> = Record<string, T>;
type PermitsStore = {
    permits: AccountRecord<HashRecord<SerializedPermitV2 | undefined>>;
    activePermitHash: AccountRecord<string | undefined>;
};
export declare const _permitStore: Omit<import("zustand/vanilla").StoreApi<PermitsStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PermitsStore, {
            permits: {};
            activePermitHash: {};
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => void | Promise<void>;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: PermitsStore) => void) => () => void;
        onFinishHydration: (fn: (state: PermitsStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<PermitsStore, {
            permits: {};
            activePermitHash: {};
        }>>;
    };
};
export declare const getPermit: (account: string | undefined, hash: string | undefined) => PermitV2 | undefined;
export declare const getActivePermit: (account: string | undefined) => PermitV2 | undefined;
export declare const getPermits: (account: string | undefined) => Record<string, PermitV2>;
export declare const setPermit: (account: string, permitV2: PermitV2) => void;
export declare const removePermit: (account: string, hash: string) => void;
export declare const getActivePermitHash: (account: string | undefined) => string | undefined;
export declare const setActivePermitHash: (account: string, hash: string) => void;
export declare const removeActivePermitHash: (account: string) => void;
export declare const permitStore: {
    store: Omit<import("zustand/vanilla").StoreApi<PermitsStore>, "persist"> & {
        persist: {
            setOptions: (options: Partial<import("zustand/middleware").PersistOptions<PermitsStore, {
                permits: {};
                activePermitHash: {};
            }>>) => void;
            clearStorage: () => void;
            rehydrate: () => void | Promise<void>;
            hasHydrated: () => boolean;
            onHydrate: (fn: (state: PermitsStore) => void) => () => void;
            onFinishHydration: (fn: (state: PermitsStore) => void) => () => void;
            getOptions: () => Partial<import("zustand/middleware").PersistOptions<PermitsStore, {
                permits: {};
                activePermitHash: {};
            }>>;
        };
    };
    getPermit: (account: string | undefined, hash: string | undefined) => PermitV2 | undefined;
    getActivePermit: (account: string | undefined) => PermitV2 | undefined;
    getPermits: (account: string | undefined) => Record<string, PermitV2>;
    setPermit: (account: string, permitV2: PermitV2) => void;
    removePermit: (account: string, hash: string) => void;
    getActivePermitHash: (account: string | undefined) => string | undefined;
    setActivePermitHash: (account: string, hash: string) => void;
    removeActivePermitHash: (account: string) => void;
};
export {};
//# sourceMappingURL=store.d.ts.map