import { TfheCompactPublicKey } from "./fhe/fhe.js";
import { Permit } from "../extensions/access_control/index.js";
export { PermitSigner } from "../extensions/access_control/index.js";
/**
 * A type representing a mapping of contract addresses to their corresponding permits.
 * Each key is a string representing the contract's address, and each value is a Permit object.
 */
export type ContractPermits = Record<string, Permit>;
/**
 * An enumeration of supported encryption types.
 * uint8, uint16, and uint32 represent the different sizes of integers that can be encrypted.
 */
export declare enum EncryptionTypes {
    bool = "bool",
    uint8 = "uint8",
    uint16 = "uint16",
    uint32 = "uint32",
    uint64 = "uint64",
    uint128 = "uint128",
    uint256 = "uint256",
    address = "address"
}
/**
 * A type representing the signature for a permit.
 * Contains a public key and a signature string.
 */
export type PermitSignature = {
    publicKey: Uint8Array;
    signature: string;
};
/**
 * A type representing the parameters to initialize an instance.
 * provider is an optional SupportedProvider for blockchain interactions.
 */
export type InstanceParams = {
    provider: SupportedProvider;
    ignoreErrors?: boolean;
    skipPubKeyFetch?: boolean;
};
/**
 * Type of the constructor of the sync fhenix client
 * fhePublicKeys are generated in the static `create` method of the sync fhenix client
 */
export type InstanceParamsWithFhePublicKeys = InstanceParams & {
    fhePublicKeys: Array<TfheCompactPublicKey | undefined>;
};
/**
 * A type representing a pair of public and private keys used for a contract, along with an optional signature.
 */
export type ContractKeypair = {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
    signature?: string | null;
};
export interface SupportedProvider {
    request?(args: {
        method: string;
        params?: unknown[];
    }): Promise<unknown>;
    send?(method: string, params?: unknown[]): Promise<unknown>;
    getSigner?(): unknown;
    getSigner?(addressOrIndex?: string | number): Promise<unknown>;
}
/**
 * Determines the request method for a given provider.
 * Checks if the provider has a 'request' method typical for Eip1193Providers, or a 'send' method for others.
 * Throws an error if neither method is found.
 * @param {SupportedProvider} provider - The provider to determine the request method for.
 * @returns {Function} - The determined request function.
 */
export declare function determineRequestMethod(provider: SupportedProvider): Function;
/**
 * Determines the request signer function for a given provider.
 * Checks if the provider has a 'getSigner' method and returns it if available.
 * Throws an error if no 'getSigner' method is found.
 * @param {SupportedProvider} provider - The provider to determine the request signer for.
 * @returns {Function} - The determined request signer function.
 */
export declare function determineRequestSigner(provider: SupportedProvider): Function;
export interface EncryptedNumber {
    data: Uint8Array;
    securityZone: number;
}
export interface EncryptedBool extends EncryptedNumber {
}
export interface EncryptedUint8 extends EncryptedNumber {
}
export interface EncryptedUint16 extends EncryptedNumber {
}
export interface EncryptedUint32 extends EncryptedNumber {
}
export interface EncryptedUint64 extends EncryptedNumber {
}
export interface EncryptedUint128 extends EncryptedNumber {
}
export interface EncryptedUint256 extends EncryptedNumber {
}
export interface EncryptedAddress extends EncryptedNumber {
}
//# sourceMappingURL=types.d.ts.map