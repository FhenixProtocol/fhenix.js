import {
  TfheCompactPublicKey,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
} from "node-tfhe";
import {
  EncryptedNumber,
  EncryptedUint16,
  EncryptedUint32,
  EncryptedUint8,
  EncryptionTypes,
} from "./types";

/**
 * Encrypts a Uint8 value using TFHE (Fast Fully Homomorphic Encryption over the Torus).
 * @param {number} value - The Uint8 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint8 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): EncryptedUint8 => {
  const uint8Array = new Uint8Array([value]);
  const encrypted = CompactFheUint8List.encrypt_with_compact_public_key(
    uint8Array,
    publicKey,
  );
  return {
    data: encrypted.serialize(),
  };
};

/**
 * Encrypts a Uint16 value using TFHE.
 * @param {number} value - The Uint16 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint16 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): EncryptedUint16 => {
  const uint16Array = new Uint16Array([value]);
  const encrypted = CompactFheUint16List.encrypt_with_compact_public_key(
    uint16Array,
    publicKey,
  );
  return {
    data: encrypted.serialize(),
  };
};

/**
 * Encrypts a Uint32 value using TFHE.
 * @param {number} value - The Uint32 value to encrypt.
 * @param {TfheCompactPublicKey} publicKey - The public key used for encryption.
 * @returns {Uint8Array} - The encrypted value serialized as Uint8Array.
 */
export const encrypt_uint32 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): EncryptedUint32 => {
  const uint32Array = new Uint32Array([value]);
  const encrypted = CompactFheUint32List.encrypt_with_compact_public_key(
    uint32Array,
    publicKey,
  );
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
export const encrypt = (
  value: number,
  publicKey: TfheCompactPublicKey,
  type: EncryptionTypes = EncryptionTypes.uint8,
): EncryptedNumber => {
  switch (type) {
    case EncryptionTypes.uint8:
      return encrypt_uint8(value, publicKey);
    case EncryptionTypes.uint16:
      return encrypt_uint16(value, publicKey);
    case EncryptionTypes.uint32:
      return encrypt_uint32(value, publicKey);
    default:
      throw new Error("Invalid type");
  }
};
