import { PermitV2 } from "./permit/permit.js";
import { InitParams, SdkStore } from "./store.js";
import { MappedCoFheEncryptedTypes } from "../types/encryptable.js";
import { PermitV2Options, PermitV2Interface, PermissionV2 } from "../types/permit.js";
import { Result } from "../types/result.js";
import { MappedUnsealedTypes } from "../types/sealed.js";
/**
 * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
 * Useful when not using `Encryptable` utility structures.
 * @param {item} value - The numeric value to encrypt.
 * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
 * @param securityZone - The security zone for which to encrypt the value (default 0).
 * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
 */
declare function encrypt<T>(item: T): Promise<Result<MappedCoFheEncryptedTypes<T>>>;
declare function encrypt<T extends any[]>(item: [...T]): Promise<Result<[...MappedCoFheEncryptedTypes<T>]>>;
/**
 * Uses the privateKey of `permit.sealingPair` to recursively unseal any contained `SealedItems`.
 * If `item` is a single `SealedItem` it will be individually.
 * NOTE: Only unseals typed `SealedItem`s returned from `FHE.sealoutputTyped` and the FHE bindings' `e____.sealTyped`.
 *
 * @param {any | any[]} item - Array, object, or item. Any nested `SealedItems` will be unsealed.
 * @returns - Recursively unsealed data in the target type, SealedBool -> boolean, SealedAddress -> string, etc.
 */
declare function unseal<T>(item: T, account?: string, hash?: string): Result<MappedUnsealedTypes<T>>;
export declare const fhenixsdk: {
    store: import("zustand/vanilla.js").StoreApi<SdkStore>;
    initialize: (params: InitParams & {
        ignoreErrors?: boolean;
        generatePermit?: boolean;
    }) => Promise<Result<PermitV2 | undefined>>;
    createPermit: (options?: PermitV2Options) => Promise<Result<PermitV2>>;
    importPermit: (imported: string | PermitV2Interface) => Promise<Result<PermitV2>>;
    selectActivePermit: (hash: string) => Result<PermitV2>;
    getPermit: (hash?: string) => Result<PermitV2>;
    getPermission: (hash?: string) => Result<PermissionV2>;
    getAllPermits: () => Result<Record<string, PermitV2>>;
    encrypt: typeof encrypt;
    unsealCiphertext: (ciphertext: string, account?: string, hash?: string) => Result<bigint>;
    unseal: typeof unseal;
};
export {};
//# sourceMappingURL=index.d.ts.map