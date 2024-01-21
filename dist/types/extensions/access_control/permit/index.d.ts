import { SupportedProvider } from '../../../sdk/types';
import { SealingKey } from '../../../sdk/sealing';
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
export declare const getPermit: (contract: string, provider: SupportedProvider) => Promise<Permit>;
export declare const getAllPermits: () => Map<string, Permit>;
export declare const generatePermit: (contract: string, provider: SupportedProvider) => Promise<Permit>;
export declare const removePermit: (contract: string) => void;
//# sourceMappingURL=index.d.ts.map