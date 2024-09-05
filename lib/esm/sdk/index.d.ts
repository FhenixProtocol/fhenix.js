import { TfheCompactPublicKey } from "./fhe/fhe.js";
import { ContractPermits, EncryptedAddress, EncryptedBool, EncryptedNumber, EncryptedUint128, EncryptedUint16, EncryptedUint256, EncryptedUint32, EncryptedUint64, EncryptedUint8, EncryptionTypes, InstanceParams, InstanceParamsWithFhePublicKeys, SupportedProvider } from "./types.js";
import { Permission, Permit, PermitSigner } from "../extensions/access_control/index.js";
declare abstract class FhenixClientBase {
    private permits;
    abstract fhePublicKeys: Array<Promise<TfheCompactPublicKey | undefined>> | Array<TfheCompactPublicKey | undefined>;
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
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedBool} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_bool(value: boolean, securityZone?: number): Promise<EncryptedBool> | EncryptedBool;
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_uint8(value: number, securityZone?: number): Promise<EncryptedUint8> | EncryptedUint8;
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_uint16(value: number, securityZone?: number): Promise<EncryptedUint16> | EncryptedUint16;
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_uint32(value: number, securityZone?: number): Promise<EncryptedUint32> | EncryptedUint32;
    /**
     * Encrypts a Uint64 value using the stored public key.
     * @param {bigint | string} value - The Uint32 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint64} - The encrypted value serialized as EncryptedUint64. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_uint64(value: bigint | string, securityZone?: number): Promise<EncryptedUint64> | EncryptedUint64;
    /**
     * Encrypts a Uint128 value using the stored public key.
     * @param {bigint | string} value - The Uint128 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint128} - The encrypted value serialized as EncryptedUint128. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_uint128(value: bigint | string, securityZone?: number): Promise<EncryptedUint128> | EncryptedUint128;
    /**
     * Encrypts a Uint256 value using the stored public key.
     * @param {bigint | string} value - The Uint256 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint256} - The encrypted value serialized as EncryptedUint256. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_uint256(value: bigint | string, securityZone?: number): Promise<EncryptedUint256> | EncryptedUint256;
    /**
     * Encrypts an Address (Uint160) value using the stored public key.
     * @param {bigint | string} value - The Address (Uint160) value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedAddress} - The encrypted value serialized as EncryptedAddress. Use the .data property to access the Uint8Array.
     */
    abstract encrypt_address(value: bigint | string, securityZone?: number): Promise<EncryptedAddress> | EncryptedAddress;
    /**
     * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
     * @param {number} value - The numeric value to encrypt.
     * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
     */
    abstract encrypt(value: number, type?: EncryptionTypes, securityZone?: number): Promise<EncryptedNumber> | EncryptedNumber;
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @param {string} account - The account attached to existing permits.
     * @returns bigint - The unsealed message.
     */
    unseal(contractAddress: string, ciphertext: string, account: string): bigint;
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
     * Reusable permit loading and storing from local storage
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit | undefined} - The permit loaded from local storage
     */
    private _loadPermitFromLocalStorage;
    /**
     * Retrieves the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit} - The permit associated with the contract address.
     */
    getPermit(contractAddress: string, account: string): Permit | undefined;
    /**
     * Retrieves all stored permits for a specific account.
     * @param {string} account - The address of the user account.
     * @returns {Record<string, Permit>} - The permits associated with each contract address.
     */
    loadAllPermitsFromLocalStorage(account: string): Record<string, Permit>;
    /**
     * Stores a permit for a specific contract address. Will overwrite any existing permit for the same contract address.
     * Does not store the permit in localstorage (should it?)
     * @param {Permit} permit - The permit to store.
     */
    storePermit(permit: Permit, account: string): void;
    /**
     * Removes a stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The account address of the permit.
     */
    removePermit(contractAddress: string, account: string): void;
    /**
     * Checks if a permit exists for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The account address attached to the stored permits
     * @returns {boolean} - True if a permit exists, false otherwise.
     */
    hasPermit(contractAddress: string, account: string): boolean;
    /**
     * Exports all stored permits.
     * @returns {ContractPermits} - All stored permits.
     */
    exportPermits(): ContractPermits;
    extractPermitPermission(permit: Permit): Permission;
    /**
     * Retrieves the FHE public key from the provider.
     * @param {SupportedProvider} provider - The provider from which to retrieve the key.
     * @param securityZone - The security zone for which to retrieve the key (default 0).
     * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
     */
    static getFheKeyFromProvider(provider: SupportedProvider, securityZone?: number): Promise<TfheCompactPublicKey>;
}
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
export declare class FhenixClient extends FhenixClientBase {
    private defaultSecurityZone;
    fhePublicKeys: Array<Promise<TfheCompactPublicKey | undefined>>;
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params: InstanceParams);
    private _getPublicKey;
    encrypt_bool(value: boolean, securityZone?: number): Promise<EncryptedBool>;
    encrypt_uint8(value: number, securityZone?: number): Promise<EncryptedUint8>;
    encrypt_uint16(value: number, securityZone?: number): Promise<EncryptedUint16>;
    encrypt_uint32(value: number, securityZone?: number): Promise<EncryptedUint32>;
    encrypt_uint64(value: bigint | string, securityZone?: number): Promise<EncryptedUint64>;
    encrypt_uint128(value: bigint | string, securityZone?: number): Promise<EncryptedUint128>;
    encrypt_uint256(value: bigint | string, securityZone?: number): Promise<EncryptedUint256>;
    encrypt_address(value: bigint | string, securityZone?: number): Promise<EncryptedAddress>;
    encrypt(value: number, type?: EncryptionTypes, securityZone?: number): Promise<EncryptedNumber>;
}
/**
 * The FhenixClientSync class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 *
 * The Sync FhenixClient allows the `client.encrypt_<xxxx>()` functions to be performed synchronously
 *
 * @Note The Sync FhenixClient must be created using `await FhenixClientSync.create({provider})` instead of `new FhenixClient({provider})`
 */
export declare class FhenixClientSync extends FhenixClientBase {
    fhePublicKeys: Array<TfheCompactPublicKey | undefined>;
    constructor(params: InstanceParamsWithFhePublicKeys);
    static create(params: InstanceParams & {
        securityZones?: number[];
    }): Promise<FhenixClientSync>;
    private _getPublicKey;
    encrypt_bool(value: boolean, securityZone?: number): EncryptedBool;
    encrypt_uint8(value: number, securityZone?: number): EncryptedUint8;
    encrypt_uint16(value: number, securityZone?: number): EncryptedUint16;
    encrypt_uint32(value: number, securityZone?: number): EncryptedUint32;
    encrypt_uint64(value: bigint | string, securityZone?: number): EncryptedUint64;
    encrypt_uint128(value: bigint | string, securityZone?: number): EncryptedUint128;
    encrypt_uint256(value: bigint | string, securityZone?: number): EncryptedUint256;
    encrypt_address(value: bigint | string, securityZone?: number): EncryptedAddress;
    encrypt(value: number, type?: EncryptionTypes, securityZone?: number): EncryptedNumber;
}
export {};
//# sourceMappingURL=index.d.ts.map