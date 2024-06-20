import { TfheCompactPublicKey } from "./fhe/fhe.js";
import { ContractPermits, EncryptedAddress, EncryptedBool, EncryptedNumber, EncryptedUint128, EncryptedUint16, EncryptedUint256, EncryptedUint32, EncryptedUint64, EncryptedUint8, EncryptionTypes, InstanceParams, SupportedProvider } from "./types.js";
import { Permission, Permit, PermitSigner } from '../extensions/access_control/index.js';
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
export declare class FhenixClient {
    private permits;
    fhePublicKey: Promise<TfheCompactPublicKey | undefined>;
    protected provider: SupportedProvider;
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params: InstanceParams);
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {EncryptedBool} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    encrypt_bool(value: boolean): Promise<EncryptedBool>;
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    encrypt_uint8(value: number): Promise<EncryptedUint8>;
    private _getPublicKey;
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
     */
    encrypt_uint16(value: number): Promise<EncryptedUint16>;
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
     */
    encrypt_uint32(value: number): Promise<EncryptedUint32>;
    /**
     * Encrypts a Uint64 value using the stored public key.
     * @param {bigint | string} value - The Uint32 value to encrypt.
     * @returns {EncryptedUint64} - The encrypted value serialized as EncryptedUint64. Use the .data property to access the Uint8Array.
     */
    encrypt_uint64(value: bigint | string): Promise<EncryptedUint64>;
    /**
     * Encrypts a Uint128 value using the stored public key.
     * @param {bigint | string} value - The Uint128 value to encrypt.
     * @returns {EncryptedUint128} - The encrypted value serialized as EncryptedUint128. Use the .data property to access the Uint8Array.
     */
    encrypt_uint128(value: bigint | string): Promise<EncryptedUint128>;
    /**
     * Encrypts a Uint256 value using the stored public key.
     * @param {bigint | string} value - The Uint256 value to encrypt.
     * @returns {EncryptedUint256} - The encrypted value serialized as EncryptedUint256. Use the .data property to access the Uint8Array.
     */
    encrypt_uint256(value: bigint | string): Promise<EncryptedUint256>;
    /**
     * Encrypts an Address (Uint160) value using the stored public key.
     * @param {bigint | string} value - The Address (Uint160) value to encrypt.
     * @returns {EncryptedAddress} - The encrypted value serialized as EncryptedAddress. Use the .data property to access the Uint8Array.
     */
    encrypt_address(value: bigint | string): Promise<EncryptedAddress>;
    /**
     * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
     * @param {number} value - The numeric value to encrypt.
     * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
     * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
     */
    encrypt(value: number, type?: EncryptionTypes): Promise<EncryptedNumber>;
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @returns bigint - The unsealed message.
     */
    unseal(contractAddress: string, ciphertext: string): bigint;
    /**
     * Creates a new permit for a specific contract address. Also saves the permit to localstorage (if available)
     * @param {string} contractAddress - The address of the contract.
     * @param {SupportedProvider} provider - The provider from which to sign the permit - must container a signer.
     * @param signer - the signer to use to sign the permit if provider does not support signing (e.g. hardhat)
     * @returns Permit - The permit associated with the contract address.
     *
     * @throws {Error} - If the provider does not contain a signer, or if a provider is not set
     */
    generatePermit(contractAddress: string, provider?: SupportedProvider, signer?: PermitSigner): Promise<Permit>;
    /**
     * Retrieves the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit} - The permit associated with the contract address.
     */
    getPermit(contractAddress: string, account: string): Permit | undefined;
    /**
     * Stores a permit for a specific contract address. Will overwrite any existing permit for the same contract address.
     * Does not store the permit in localstorage (should it?)
     * @param {Permit} permit - The permit to store.
     */
    storePermit(permit: Permit): void;
    /**
     * Removes a stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     */
    removePermit(contractAddress: string): void;
    /**
     * Checks if a permit exists for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @returns {boolean} - True if a permit exists, false otherwise.
     */
    hasPermit(contractAddress: string): boolean;
    /**
     * Exports all stored permits.
     * @returns {ContractPermits} - All stored permits.
     */
    exportPermits(): ContractPermits;
    extractPermitPermission(permit: Permit): Permission;
    /**
     * Retrieves the FHE public key from the provider.
     * @param {SupportedProvider} provider - The provider from which to retrieve the key.
     * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
     */
    private static getFheKeyFromProvider;
}
//# sourceMappingURL=index.d.ts.map