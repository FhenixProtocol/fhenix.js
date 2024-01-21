"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = exports.encrypt_uint32 = exports.encrypt_uint16 = exports.encrypt_uint8 = void 0;
const node_tfhe_1 = require("node-tfhe");
const types_1 = require("./types");
/**
 * Encrypts a Uint8 value using TFHE (Fast Fully Homomorphic Encryption over the Torus).
 * @param {number} value - The Uint8 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
const encrypt_uint8 = (value, publicKey) => {
    const uint8Array = new Uint8Array([value]);
    const encrypted = node_tfhe_1.CompactFheUint8List.encrypt_with_compact_public_key(uint8Array, publicKey);
    return encrypted.serialize();
};
exports.encrypt_uint8 = encrypt_uint8;
/**
 * Encrypts a Uint16 value using TFHE.
 * @param {number} value - The Uint16 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
const encrypt_uint16 = (value, publicKey) => {
    const uint16Array = new Uint16Array([value]);
    const encrypted = node_tfhe_1.CompactFheUint16List.encrypt_with_compact_public_key(uint16Array, publicKey);
    return encrypted.serialize();
};
exports.encrypt_uint16 = encrypt_uint16;
/**
 * Encrypts a Uint32 value using TFHE.
 * @param {number} value - The Uint32 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
const encrypt_uint32 = (value, publicKey) => {
    const uint32Array = new Uint32Array([value]);
    const encrypted = node_tfhe_1.CompactFheUint32List.encrypt_with_compact_public_key(uint32Array, publicKey);
    return encrypted.serialize();
};
exports.encrypt_uint32 = encrypt_uint32;
/**
 * Encrypts a numeric value using TFHE according to the specified encryption type.
 * @param {number} value - The numeric value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @param {EncryptionTypes} type - The encryption type (uint8, uint16, uint32).
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 * @throws {Error} - Throws an error if an invalid type is specified.
 */
const encrypt = (value, publicKey, type = types_1.EncryptionTypes.uint8) => {
    switch (type) {
        case types_1.EncryptionTypes.uint8:
            return (0, exports.encrypt_uint8)(value, publicKey);
        case types_1.EncryptionTypes.uint16:
            return (0, exports.encrypt_uint16)(value, publicKey);
        case types_1.EncryptionTypes.uint32:
            return (0, exports.encrypt_uint32)(value, publicKey);
        default:
            throw new Error('Invalid type');
    }
};
exports.encrypt = encrypt;
//# sourceMappingURL=encrypt.js.map