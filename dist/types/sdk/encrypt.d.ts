import { TfheCompactPublicKey } from 'node-tfhe';
import { EncryptionTypes } from './types';
/**
 * Encrypts a Uint8 value using TFHE (Fast Fully Homomorphic Encryption over the Torus).
 * @param {number} value - The Uint8 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
export declare const encrypt_uint8: (value: number, publicKey: TfheCompactPublicKey) => Uint8Array;
/**
 * Encrypts a Uint16 value using TFHE.
 * @param {number} value - The Uint16 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
export declare const encrypt_uint16: (value: number, publicKey: TfheCompactPublicKey) => Uint8Array;
/**
 * Encrypts a Uint32 value using TFHE.
 * @param {number} value - The Uint32 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
export declare const encrypt_uint32: (value: number, publicKey: TfheCompactPublicKey) => Uint8Array;
/**
 * Encrypts a numeric value using TFHE according to the specified encryption type.
 * @param {number} value - The numeric value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @param {EncryptionTypes} type - The encryption type (uint8, uint16, uint32).
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 * @throws {Error} - Throws an error if an invalid type is specified.
 */
export declare const encrypt: (value: number, publicKey: TfheCompactPublicKey, type?: EncryptionTypes) => Uint8Array;
//# sourceMappingURL=encrypt.d.ts.map