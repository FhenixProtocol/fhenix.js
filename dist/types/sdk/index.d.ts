import { TfheCompactPublicKey } from "node-tfhe";
import { ContractPermits, InstanceParams, EncryptionTypes } from "./types";
import { Permit, Permission } from "../extensions/access_control";
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
export declare class FhenixClient {
    private permits;
    fhePublicKey: Promise<TfheCompactPublicKey | undefined>;
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params: InstanceParams);
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt_uint8(value: number): Promise<Uint8Array>;
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt_uint16(value: number): Promise<Uint8Array>;
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt_uint32(value: number): Promise<Uint8Array>;
    /**
     * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
     * @param {number} value - The numeric value to encrypt.
     * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
     * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
     */
    encrypt(value: number, type?: EncryptionTypes): Promise<Uint8Array>;
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @returns {any} - The unsealed message.
     */
    unseal(contractAddress: string, ciphertext: string): bigint;
    /**
     * Retrieves the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @returns {Permit} - The permit associated with the contract address.
     */
    getPermit(contractAddress: string): Permit;
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