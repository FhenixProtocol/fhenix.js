/* eslint-disable @typescript-eslint/no-explicit-any */
import { TfheCompactPublicKey } from "./fhe/fhe.js";
import { Permit } from "../extensions/access_control/index.js";
import { Primitive } from "type-fest";
import { PermissionV2 } from "../extensions/types.js";
export { PermitSigner } from "../extensions/access_control/index.js";

/**
 * A type representing a mapping of contract addresses to their corresponding permits.
 * Each key is a string representing the contract's address, and each value is a Permit object.
 */
export type ContractPermits = Record<string, Permit>;

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
export const FheUintUTypes = [
  FheUType.uint8,
  FheUType.uint16,
  FheUType.uint32,
  FheUType.uint64,
  FheUType.uint128,
  FheUType.uint256,
] as const;
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

/**
 * A type representing the signature for a permit.
 * Contains a public key and a signature string.
 */
export type PermitSignature = {
  publicKey: Uint8Array;
  signature: string;
};

/**
 * A type representing the parameters to initialize an instance.
 * provider is an optional SupportedProvider for blockchain interactions.
 */
export type InstanceParams = {
  provider: SupportedProvider;
  ignoreErrors?: boolean;
};

/**
 * Type of the constructor of the sync fhenix client
 * fhePublicKeys are generated in the static `create` method of the sync fhenix client
 */
export type InstanceParamsWithFhePublicKeys = InstanceParams & {
  fhePublicKeys: Array<TfheCompactPublicKey | undefined>;
};

/**
 * A type representing a pair of public and private keys used for a contract, along with an optional signature.
 */
export type ContractKeypair = {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  signature?: string | null;
};

// Define the SupportedProvider interface
export interface SupportedProvider {
  request?(args: { method: string; params?: unknown[] }): Promise<unknown>;
  send?(method: string, params?: unknown[]): Promise<unknown>;
  getSigner?(): unknown;
  getSigner?(addressOrIndex?: string | number): Promise<unknown>;
}

/**
 * Determines the request method for a given provider.
 * Checks if the provider has a 'request' method typical for Eip1193Providers, or a 'send' method for others.
 * Throws an error if neither method is found.
 * @param {SupportedProvider} provider - The provider to determine the request method for.
 * @returns {Function} - The determined request function.
 */
// eslint-disable-next-line  @typescript-eslint/ban-types
export function determineRequestMethod(provider: SupportedProvider): Function {
  if ("request" in provider && typeof provider.request === "function") {
    return (p: SupportedProvider, method: string, params?: unknown[]) =>
      (
        p.request as ({
          method,
          params,
        }: {
          method: string;
          params?: unknown[];
        }) => Promise<unknown>
      )({ method, params });
  } else if ("send" in provider && typeof provider.send === "function") {
    return (p: SupportedProvider, method: string, params?: unknown[]) =>
      (p.send as (method: string, params?: unknown[]) => Promise<unknown>)(
        method,
        params,
      );
  } else {
    throw new Error(
      "Received unsupported provider. 'send' or 'request' method not found",
    );
  }
}

/**
 * Determines the request signer function for a given provider.
 * Checks if the provider has a 'getSigner' method and returns it if available.
 * Throws an error if no 'getSigner' method is found.
 * @param {SupportedProvider} provider - The provider to determine the request signer for.
 * @returns {Function} - The determined request signer function.
 */
// eslint-disable-next-line  @typescript-eslint/ban-types
export function determineRequestSigner(provider: SupportedProvider): Function {
  if ("getSigner" in provider && typeof provider.getSigner === "function") {
    return (p: SupportedProvider) => (p.getSigner as () => unknown)();
  } else {
    throw new Error("The supplied provider cannot get a signer");
  }
}

export type EncryptedNumber = {
  data: Uint8Array;
  securityZone: number;
};

export type EncryptedBool = EncryptedNumber;
export type EncryptedUint8 = EncryptedNumber;
export type EncryptedUint16 = EncryptedNumber;
export type EncryptedUint32 = EncryptedNumber;
export type EncryptedUint64 = EncryptedNumber;
export type EncryptedUint128 = EncryptedNumber;
export type EncryptedUint256 = EncryptedNumber;
export type EncryptedAddress = EncryptedNumber;

export type EncryptableBool = {
  data: boolean;
  securityZone?: number;
  utype: FheUType.bool;
};
export type EncryptableUint8 = {
  data: number;
  securityZone?: number;
  utype: FheUType.uint8;
};
export type EncryptableUint16 = {
  data: number;
  securityZone?: number;
  utype: FheUType.uint16;
};
export type EncryptableUint32 = {
  data: number;
  securityZone?: number;
  utype: FheUType.uint32;
};
export type EncryptableUint64 = {
  data: string | bigint;
  securityZone?: number;
  utype: FheUType.uint64;
};
export type EncryptableUint128 = {
  data: string | bigint;
  securityZone?: number;
  utype: FheUType.uint128;
};
export type EncryptableUint256 = {
  data: string | bigint;
  securityZone?: number;
  utype: FheUType.uint256;
};
export type EncryptableAddress = {
  data: string;
  securityZone?: number;
  utype: FheUType.address;
};

export type EncryptableItem =
  | EncryptableBool
  | EncryptableUint8
  | EncryptableUint16
  | EncryptableUint32
  | EncryptableUint64
  | EncryptableUint128
  | EncryptableUint256
  | EncryptableAddress;

export type EncryptedItemMap<E extends EncryptableItem> = {
  [FheUType.bool]: EncryptedBool;
  [FheUType.uint8]: EncryptedUint8;
  [FheUType.uint16]: EncryptedUint16;
  [FheUType.uint32]: EncryptedUint32;
  [FheUType.uint64]: EncryptedUint64;
  [FheUType.uint128]: EncryptedUint128;
  [FheUType.uint256]: EncryptedUint256;
  [FheUType.address]: EncryptedAddress;
}[E["utype"]];

export type MappedEncryptedTypes<T> = T extends "permission"
  ? PermissionV2
  : T extends Primitive
    ? T
    : T extends EncryptableItem
      ? EncryptedItemMap<T>
      : {
          [K in keyof T]: MappedEncryptedTypes<T[K]>;
        };

export function isEncryptableItem(value: any): value is EncryptableItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.data === "string" &&
    typeof value.securityZone === "number" &&
    FheAllUTypes.includes(value.utype)
  );
}

export type SealedBool = {
  data: string;
  utype: FheUType.bool;
};
export type SealedUint = {
  data: string;
  utype: (typeof FheUintUTypes)[number];
};
export type SealedAddress = {
  data: string;
  utype: FheUType.address;
};
export type SealedItem = SealedBool | SealedUint | SealedAddress;

export type UnsealedItemMap<S extends SealedItem> = S extends SealedBool
  ? boolean
  : S extends SealedUint
    ? bigint
    : S extends SealedAddress
      ? string
      : never;

export type MappedUnsealedTypes<T> = T extends Primitive
  ? T
  : T extends SealedItem
    ? UnsealedItemMap<T>
    : {
        [K in keyof T]: MappedUnsealedTypes<T[K]>;
      };

// Type guard for any SealedItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSealedItem(value: any): value is SealedItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.data === "string" &&
    FheAllUTypes.includes(value.utype)
  );
}

// Type guard for SealedBool
export function isSealedBool(value: SealedItem): value is SealedBool {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.data === "string" &&
    value.utype === FheUType.bool
  );
}

// Type guard for SealedUint
export function isSealedUint(value: SealedItem): value is SealedUint {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.data === "string" &&
    FheUintUTypes.includes(value.utype as number)
  );
}

// Type guard for SealedAddress
export function isSealedAddress(value: SealedItem): value is SealedAddress {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.data === "string" &&
    value.utype === FheUType.address
  );
}

export type Result<T, E = string> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: E };

export const ResultErr = <T, E>(error: E): Result<T, E> => ({
  success: false,
  data: null,
  error,
});

export const ResultOk = <T, E>(data: T): Result<T, E> => ({
  success: true,
  data,
  error: null,
});
