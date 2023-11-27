import {
  TfheCompactPublicKey,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
} from 'node-tfhe';


export enum UintTypes {
  uint8 = 'uint8',
  uint16 = 'uint16',
  uint32 = 'uint32',
}

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

export const encrypt = (value: number, publicKey: TfheCompactPublicKey, type: UintTypes = UintTypes.uint8): Uint8Array => {
  switch (type) {
    case UintTypes.uint8:
      return encrypt_uint8(value, publicKey);
    case UintTypes.uint16:
      return encrypt_uint16(value, publicKey);
    case UintTypes.uint32:
      return encrypt_uint32(value, publicKey);
    default:
      throw new Error('Invalid type');
  }

}
