import { FheUType } from "./base";

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
