import { PermitV2 } from "./permit.js";
import { MappedEncryptedTypes, Result, PermissionV2, PermitV2Interface, PermitV2Options } from "./types.js";
import { InitParams, SdkStore } from "./sdk.store.js";
import { EncryptedNumber, EncryptionTypes } from "../types.js";
declare function encrypt<T>(item: T): MappedEncryptedTypes<T>;
declare function encrypt<T extends any[]>(item: [...T]): [...MappedEncryptedTypes<T>];
/**
 * Uses the privateKey of `permit.sealingPair` to recursively unseal any contained `SealedItems`.
 * If `item` is a single `SealedItem` it will be individually.
 * NOTE: Only unseals typed `SealedItem`s returned from `FHE.sealoutputTyped` and the FHE bindings' `e____.sealTyped`.
 *
 * @param {any | any[]} item - Array, object, or item. Any nested `SealedItems` will be unsealed.
 * @returns - Recursively unsealed data in the target type, SealedBool -> boolean, SealedAddress -> string, etc.
 */
declare function unseal<T>(item: T, account?: string, hash?: string): import("./types.js").MappedUnsealedTypes<T>;
export declare const fhenixsdk: {
    store: import("zustand/vanilla.js").StoreApi<SdkStore>;
    initialize: (params: InitParams & {
        ignoreErrors?: boolean;
    }) => Promise<void>;
    createPermit: (options?: PermitV2Options) => Promise<PermitV2>;
    importPermit: (imported: string | PermitV2Interface) => Promise<void>;
    selectActivePermit: (hash: string) => void;
    getPermit: (hash?: string) => Result<PermitV2>;
    getPermission: (hash?: string) => Result<PermissionV2>;
    getAllPermits: () => Result<Record<string, PermitV2>>;
    encryptValue: (value: number, type?: EncryptionTypes, securityZone?: number) => EncryptedNumber;
    encrypt: typeof encrypt;
    unsealCiphertext: (ciphertext: string, account?: string, hash?: string) => bigint;
    unseal: typeof unseal;
};
export {};
//# sourceMappingURL=sdk.d.ts.map