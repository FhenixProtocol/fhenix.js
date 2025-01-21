/**
 * An enumeration of supported encryption types.
 * uint8, uint16, and uint32 represent the different sizes of integers that can be encrypted.
 */
export enum EncryptionTypes {
  bool = "bool",
  uint8 = "uint8",
  uint16 = "uint16",
  uint32 = "uint32",
  uint64 = "uint64",
  uint128 = "uint128",
  uint256 = "uint256",
  address = "address",
}

/**
 * Mapping of encryption types to their utype integer
 */
export enum FheUType {
  bool = 13,
  uint8 = 0,
  uint16 = 1,
  uint32 = 2,
  uint64 = 3,
  uint128 = 4,
  uint256 = 5,
  address = 12,
}

/**
 * List of All FHE uint types (excludes bool and address)
 */
export const FheUintUTypes = [
  FheUType.uint8,
  FheUType.uint16,
  FheUType.uint32,
  FheUType.uint64,
  FheUType.uint128,
  FheUType.uint256,
] as const;

/**
 * List of All FHE types (uints, bool, and address)
 */
export const FheAllUTypes = [
  FheUType.bool,
  FheUType.uint8,
  FheUType.uint16,
  FheUType.uint32,
  FheUType.uint64,
  FheUType.uint128,
  FheUType.uint256,
  FheUType.address,
] as const;

export type EncryptedNumber = {
  data: Uint8Array;
  securityZone: number;
};

export interface EncryptedBool extends EncryptedNumber {}
export interface EncryptedUint8 extends EncryptedNumber {}
export interface EncryptedUint16 extends EncryptedNumber {}
export interface EncryptedUint32 extends EncryptedNumber {}
export interface EncryptedUint64 extends EncryptedNumber {}
export interface EncryptedUint128 extends EncryptedNumber {}
export interface EncryptedUint256 extends EncryptedNumber {}
export interface EncryptedAddress extends EncryptedNumber {}

export type CoFheEncryptedNumber = {
  securityZone: number;
  hash: bigint;
  signature: string;
  utype: FheUType;
};
export type CoFheEncryptedBool = CoFheEncryptedNumber & {
  utype: FheUType.bool;
};
export type CoFheEncryptedUint8 = CoFheEncryptedNumber & {
  utype: FheUType.uint8;
};
export type CoFheEncryptedUint16 = CoFheEncryptedNumber & {
  utype: FheUType.uint16;
};
export type CoFheEncryptedUint32 = CoFheEncryptedNumber & {
  utype: FheUType.uint32;
};
export type CoFheEncryptedUint64 = CoFheEncryptedNumber & {
  utype: FheUType.uint64;
};
export type CoFheEncryptedUint128 = CoFheEncryptedNumber & {
  utype: FheUType.uint128;
};
export type CoFheEncryptedUint256 = CoFheEncryptedNumber & {
  utype: FheUType.uint256;
};
export type CoFheEncryptedAddress = CoFheEncryptedNumber & {
  utype: FheUType.address;
};
