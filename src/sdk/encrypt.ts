import {
  TfheCompactPublicKey,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
} from 'node-tfhe';
import { EncryptionTypes } from './types';

export const encrypt_uint8 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint8Array = new Uint8Array([value]);
  const encrypted = CompactFheUint8List.encrypt_with_compact_public_key(
    uint8Array,
    publicKey,
  );
  return encrypted.serialize();
};

export const encrypt_uint16 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint16Array = new Uint16Array([value]);
  const encrypted = CompactFheUint16List.encrypt_with_compact_public_key(
    uint16Array,
    publicKey,
  );
  return encrypted.serialize();
};

export const encrypt_uint32 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint32Array = new Uint32Array([value]);
  const encrypted = CompactFheUint32List.encrypt_with_compact_public_key(
    uint32Array,
    publicKey,
  );
  return encrypted.serialize();
};

export const encrypt = (value: number, publicKey: TfheCompactPublicKey, type: EncryptionTypes = EncryptionTypes.uint8): Uint8Array => {
  switch (type) {
    case EncryptionTypes.uint8:
      return encrypt_uint8(value, publicKey);
    case EncryptionTypes.uint16:
      return encrypt_uint16(value, publicKey);
    case EncryptionTypes.uint32:
      return encrypt_uint32(value, publicKey);
    default:
      throw new Error('Invalid type');
  }

}
