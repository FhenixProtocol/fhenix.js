import { TfheCompactPublicKey } from "./fhe/fhe";
import { AbstractProvider, AbstractSigner } from "../types/permit";
type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;
type PermitV2AccessRequirements = {
    contracts: string[];
    projects: string[];
};
type PermitV2AccessRequirementsParams = {
    contracts?: never[];
    projects: string[];
} | {
    contracts: string[];
    projects?: never[];
};
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
    coFhe: {
        enabled: boolean;
        url: string | undefined;
    };
};
export declare const _sdkStore: import("zustand/vanilla").StoreApi<SdkStore>;
export declare const _store_chainId: () => string | undefined;
export declare const _store_getFheKey: (chainId: string | undefined, securityZone?: number) => TfheCompactPublicKey | undefined;
export declare const _store_getConnectedChainFheKey: (securityZone?: number) => TfheCompactPublicKey | undefined;
export declare const _store_setFheKey: (chainId: string | undefined, securityZone: number | undefined, fheKey: TfheCompactPublicKey | undefined) => void;
export type InitParams = {
    provider: AbstractProvider;
    signer?: AbstractSigner;
    securityZones?: number[];
    isCoFhe?: boolean;
    coFheUrl?: string;
} & PermitV2AccessRequirementsParams;
export declare const _store_initialize: (params: InitParams) => Promise<void>;
/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {string} chainId - The chain to fetch the FHE key for, if no chainId provided, undefined is returned
 * @param {Provider} provider - EthersV6 Provider that performs the key fetch.
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
export declare const _store_fetchFheKey: (chainId: string, provider: AbstractProvider, securityZone?: number, forceFetch?: boolean) => Promise<TfheCompactPublicKey>;
export {};
//# sourceMappingURL=store.d.ts.map