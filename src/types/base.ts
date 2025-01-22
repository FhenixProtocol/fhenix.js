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
