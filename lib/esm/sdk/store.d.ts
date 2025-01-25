import { TfheCompactPublicKey } from "./fhe/fhe";
import { AbstractProvider, AbstractSigner, InitializationParams, PermitV2AccessRequirements } from "../types";
type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;
type SdkStoreProviderInitialization = {
    providerInitialized: false;
    signer: never;
    account: never;
} | {
    providerInitialized: true;
    provider: AbstractProvider;
    chainId: string;
};
type SdkStoreSignerInitialization = {
    signerInitialized: false;
    signer: never;
    account: never;
} | {
    signerInitialized: true;
    signer: AbstractSigner;
    account: string;
};
export type SdkStore = SdkStoreProviderInitialization & SdkStoreSignerInitialization & {
    provider: AbstractProvider;
    chainId: string;
    fheKeysInitialized: boolean;
    securityZones: number[];
    fheKeys: ChainRecord<SecurityZoneRecord<Uint8Array | undefined>>;
    accessRequirements: PermitV2AccessRequirements;
    coFheUrl: string | undefined;
};
export declare const _sdkStore: import("zustand/vanilla").StoreApi<SdkStore>;
export declare const _store_getConnectedChainFheKey: (securityZone?: number) => TfheCompactPublicKey | undefined;
export declare const _store_setFheKey: (chainId: string | undefined, securityZone: number | undefined, fheKey: TfheCompactPublicKey | undefined) => void;
export declare const _store_initialize: (params: InitializationParams) => Promise<void>;
/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {string} chainId - The chain to fetch the FHE key for, if no chainId provided, undefined is returned
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
export declare const _store_fetchFheKey: (chainId: string, securityZone?: number, forceFetch?: boolean) => Promise<TfheCompactPublicKey>;
export {};
//# sourceMappingURL=store.d.ts.map