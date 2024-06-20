import { CompactFheBool, CompactFheUint8, CompactFheUint16, CompactFheUint32, CompactFheUint64, CompactFheUint128, CompactFheUint160, CompactFheUint256, } from "./fhe/fhe.js";
import { EncryptionTypes, } from "./types.js";
import { fromHexString, toBigInt } from "./utils.js";
/**
 * Encrypts a Uint8 value using TFHE (Fast Fully Homomorphic Encryption over the Torus).
 * @param {boolean} value - The Boolean value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedBool} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_bool = (value, publicKey) => {
    const encrypted = CompactFheBool.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a Uint8 value using TFHE (Fast Fully Homomorphic Encryption over the Torus).
 * @param {number} value - The Uint8 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedUint8} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint8 = (value, publicKey) => {
    const encrypted = CompactFheUint8.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a Uint16 value using TFHE.
 * @param {number} value - The Uint16 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedUint16} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint16 = (value, publicKey) => {
    const encrypted = CompactFheUint16.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a Uint32 value using TFHE.
 * @param {number} value - The Uint32 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedUint32} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint32 = (value, publicKey) => {
    const encrypted = CompactFheUint32.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a Uint64 value using TFHE.
 * @param {number} value - The Uint64 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedUint64} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint64 = (value, publicKey) => {
    if (typeof value === "string") {
        value = toBigInt(fromHexString(value));
    }
    else {
        value = value;
    }
    const encrypted = CompactFheUint64.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a Uint128 value using TFHE.
 * @param {bigint} value - The Uint128 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedUint128} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint128 = (value, publicKey) => {
    if (typeof value === "string") {
        value = toBigInt(fromHexString(value));
    }
    else {
        value = value;
    }
    const encrypted = CompactFheUint128.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a Uint256 value using TFHE.
 * @param {bigint} value - The Uint256 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedUint256} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint256 = (value, publicKey) => {
    if (typeof value === "string") {
        value = toBigInt(fromHexString(value));
    }
    else {
        value = value;
    }
    const encrypted = CompactFheUint256.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a Address value using TFHE.
 * @param {bigint} value - The Address (Uint160) value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {EncryptedAddress} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_address = (value, publicKey) => {
    if (typeof value === "string") {
        value = toBigInt(fromHexString(value));
    }
    else {
        value = value;
    }
    const encrypted = CompactFheUint160.encrypt_with_compact_public_key(value, publicKey);
    return {
        data: encrypted.serialize(),
    };
};
/**
 * Encrypts a numeric value using TFHE according to the specified encryption type.
 * @param {number} value - The numeric value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @param {EncryptionTypes} type - The encryption type (uint8, uint16, uint32).
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 * @throws {Error} - Throws an error if an invalid type is specified.
 */
export const encrypt = (value, publicKey, type = EncryptionTypes.uint8) => {
    switch (type) {
        case EncryptionTypes.bool:
            return encrypt_bool(!!value, publicKey);
        case EncryptionTypes.uint8:
            return encrypt_uint8(value, publicKey);
        case EncryptionTypes.uint16:
            return encrypt_uint16(value, publicKey);
        case EncryptionTypes.uint32:
            return encrypt_uint32(value, publicKey);
        case EncryptionTypes.uint64:
            return encrypt_uint64(value.toString(16), publicKey);
        case EncryptionTypes.uint128:
            return encrypt_uint128(value.toString(16), publicKey);
        case EncryptionTypes.uint256:
            return encrypt_uint256(value.toString(16), publicKey);
        case EncryptionTypes.address:
            return encrypt_address(value.toString(16), publicKey);
        default:
            throw new Error("Invalid type");
    }
};
//# sourceMappingURL=encrypt.js.map