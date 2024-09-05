import { SupportedProvider } from "../../../sdk/types.js";
import { SealingKey } from "../../../sdk/sealing.js";
export type Permission = {
    signature: string;
    publicKey: string;
};
/**
 * Represents a permit with cryptographic properties.
 */
export type Permit = {
    /**
     * The Ethereum contract address associated with the permit.
     */
    contractAddress: string;
    /**
     * The sealing key information required to seal or unseal data related to the permit.
     */
    sealingKey: SealingKey;
    /**
     * A cryptographic signature proving the authenticity and integrity of the permit.
     */
    signature: string;
    /**
     * The public key corresponding to the private key used to generate the signature.
     */
    publicKey: string;
};
export declare const getPermit: (contract: string, provider: SupportedProvider, autoGenerate?: boolean) => Promise<Permit | null>;
export declare const getAllExistingPermits: (account: string) => Record<string, Permit>;
export declare const getAllPermits: () => Map<string, Permit>;
interface SignerPublicSignedTypedData {
    signTypedData(domain: object, types: object, value: object): Promise<string>;
    getAddress(): Promise<string>;
}
interface SignerPrivateSignedTypedData {
    _signTypedData(domain: object, types: object, value: object): Promise<string>;
    getAddress(): Promise<string>;
}
export type PermitSigner = SignerPrivateSignedTypedData | SignerPublicSignedTypedData;
export declare const generatePermit: (contract: string, provider: SupportedProvider, customSigner?: PermitSigner) => Promise<Permit>;
export declare const removePermit: (contract: string, account: string) => void;
export declare const getPermitFromLocalstorage: (contract: string, account: string) => Permit | undefined;
export declare const storePermitInLocalStorage: (permit: Permit, account: string) => void;
export declare const removePermitFromLocalstorage: (contract: string, account: string) => void;
export {};
//# sourceMappingURL=index.d.ts.map