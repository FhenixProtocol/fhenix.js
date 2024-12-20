import { Primitive, LiteralToPrimitive } from "type-fest";
import { SealingKey } from "../sealing";
import {
  EncryptedBool,
  EncryptedUint8,
  EncryptedUint16,
  EncryptedUint32,
  EncryptedUint64,
  EncryptedUint128,
  EncryptedUint256,
  EncryptedAddress,
} from "../types";

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

export const Encryptable = {
  bool: (data: EncryptableBool["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.bool }) as EncryptableBool,
  uint8: (data: EncryptableUint8["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.uint8 }) as EncryptableUint8,
  uint16: (data: EncryptableUint16["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.uint16 }) as EncryptableUint16,
  uint32: (data: EncryptableUint32["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.uint32 }) as EncryptableUint32,
  uint64: (data: EncryptableUint64["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.uint64 }) as EncryptableUint64,
  uint128: (data: EncryptableUint128["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.uint128 }) as EncryptableUint128,
  uint256: (data: EncryptableUint256["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.uint256 }) as EncryptableUint256,
  address: (data: EncryptableAddress["data"], securityZone = 0) =>
    ({ data, securityZone, utype: FheUType.address }) as EncryptableAddress,
} as const;

export type EncryptableItem =
  | EncryptableBool
  | EncryptableUint8
  | EncryptableUint16
  | EncryptableUint32
  | EncryptableUint64
  | EncryptableUint128
  | EncryptableUint256
  | EncryptableAddress;

export type EncryptedItemMap<E extends EncryptableItem> =
  E extends EncryptableBool
    ? EncryptedBool
    : E extends EncryptableUint8
      ? EncryptedUint8
      : E extends EncryptableUint16
        ? EncryptedUint16
        : E extends EncryptableUint32
          ? EncryptedUint32
          : E extends EncryptableUint64
            ? EncryptedUint64
            : E extends EncryptableUint128
              ? EncryptedUint128
              : E extends EncryptableUint256
                ? EncryptedUint256
                : E extends EncryptableAddress
                  ? EncryptedAddress
                  : never;

export type MappedEncryptedTypes<T> = T extends "permission"
  ? PermissionV2
  : T extends Primitive
    ? LiteralToPrimitive<T>
    : T extends EncryptableItem
      ? EncryptedItemMap<T>
      : {
          [K in keyof T]: MappedEncryptedTypes<T[K]>;
        };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEncryptableItem(value: any): value is EncryptableItem {
  return (
    typeof value === "object" &&
    value !== null &&
    ["string", "number", "bigint", "boolean"].includes(typeof value.data) &&
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
  ? LiteralToPrimitive<T>
  : T extends SealedItem
    ? UnsealedItemMap<T>
    : {
        [K in keyof T]: MappedUnsealedTypes<T[K]>;
      };

// Determine if `value` is an instance of a `sealedItem` { data: string, utype: 0-5 | 12 | 13 }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAsSealedItem(value: any): SealedItem | undefined {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "string" &&
    FheAllUTypes.includes(parseInt(`${value[1]}`))
  )
    return {
      data: value[0],
      utype: value[1],
    };

  if (
    typeof value === "object" &&
    value !== null &&
    typeof value.data === "string" &&
    FheAllUTypes.includes(value.utype)
  )
    return value as SealedItem;

  return undefined;
}

export function isSealedBool(value: SealedItem): boolean {
  return parseInt(`${value.utype}`) === FheUType.bool;
}

export function isSealedUint(value: SealedItem): boolean {
  return FheUintUTypes.includes(parseInt(`${value.utype}`));
}

export function isSealedAddress(value: SealedItem): boolean {
  return parseInt(`${value.utype}`) === FheUType.address;
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

// Permit V2 Types

export interface AbstractProvider {
  getChainId(): Promise<string>;
  call(tx: { to: string; data: string }): Promise<string>;
}

export interface AbstractSigner {
  getAddress(): Promise<string>;
  signTypedData(
    domain: object,
    types: Record<string, Array<object>>,
    value: object,
  ): Promise<string>;
}

/**
 * Type representing the full PermitV2
 */
export type PermitV2Interface = {
  /**
   * Name for this permit, for organization and UI usage, not included in signature.
   */
  name: string;
  /**
   * The type of the PermitV2 (self / sharing)
   * (self) Permit that will be signed and used by the issuer
   * (sharing) Permit that is signed by the issuer, but intended to be shared with recipient
   * (recipient) Permit that has been received, and signed by the recipient
   */
  type: "self" | "sharing" | "recipient";
  /**
   * (base) User that initially created the permission, target of data fetching
   */
  issuer: string;
  /**
   * (base) Expiration timestamp
   */
  expiration: number;
  /**
   * (base) List of contract addresses that can be accessed with this permission
   */
  contracts: string[];
  /**
   * (base) List of project identifiers (strings) that can be accessed
   */
  projects: string[];
  /**
   * (sharing) The user that this permission will be shared with
   * ** optional, use `address(0)` to disable **
   */
  recipient: string;
  /**
   * (issuer defined validation) An id used to query a contract to check this permissions validity
   * ** optional, use `0` to disable **
   */
  validatorId: number;
  /**
   * (issuer defined validation) The contract to query to determine permission validity
   * ** optional, user `address(0)` to disable **
   */
  validatorContract: string;
  /**
   * (base) The publicKey of a sealingPair used to re-encrypt `issuer`s confidential data
   *   (non-sharing) Populated by `issuer`
   *   (sharing)     Populated by `recipient`
   */
  sealingPair: SealingKey;
  /**
   * (base) `signTypedData` signature created by `issuer`.
   * (base) Shared- and Self- permissions differ in signature format: (`sealingKey` absent in shared signature)
   *   (non-sharing) < issuer, expiration, contracts, projects, recipient, validatorId, validatorContract, sealingKey >
   *   (sharing)     < issuer, expiration, contracts, projects, recipient, validatorId, validatorContract >
   */
  issuerSignature: string;
  /**
   * (sharing) `signTypedData` signature created by `recipient` with format:
   * (sharing) < sealingKey, issuerSignature>
   * ** required for shared permits **
   */
  recipientSignature: string;
};

/**
 * Optional additional metadata of a PermitV2
 * Can be passed into the constructor, but not necessary
 * Useful for deserialization
 */
export type PermitV2Metadata = {
  /**
   * Chain that this permit was signed on. In part used for mock encrypt/unseal on hardhat network.
   * Should not be set manually, included in metadata as part of serialization flows.
   */
  _signedChainId: string | undefined;
};

export type PickPartial<T, F extends keyof T> = Expand<
  Omit<T, F> & Partial<Pick<T, F>>
>;

export type PermitV2Satisfiers = Expand<
  Pick<PermitV2Interface, "contracts" | "projects">
>;

export type PermitV2Core = Expand<
  Pick<PermitV2Interface, "issuer"> &
    Partial<
      Pick<
        PermitV2Interface,
        | "contracts"
        | "projects"
        | "recipient"
        | "validatorId"
        | "validatorContract"
      >
    >
>;
// export type PermitV2Options = Expand<
//   Partial<PermitV2Interface> & Pick<PermitV2Interface, "type" | "issuer">
// >;

export type PermitV2Options =
  // Self permit requires at minimum `issuer`, excludes `recipient` and `recipientSignature`
  | Expand<
      Partial<Omit<PermitV2Interface, "recipient" | "recipientSignature">> & {
        type: "self";
        issuer: string;
      }
    >
  // Sharing permit requires at minimum `issuer` and `recipient`, excludes `recipientSignature`
  | Expand<
      Partial<Omit<PermitV2Interface, "recipientSignature">> & {
        type: "sharing";
        issuer: string;
        recipient: string;
      }
    >
  // Recipient permit requires the full issuer's permit
  | Expand<
      Partial<PermitV2Interface> & {
        type: "recipient";
        issuer: string;
        recipient: string;
        issuerSignature: string;
      }
    >;

export type SerializedPermitV2 = Omit<PermitV2Interface, "sealingPair"> &
  PermitV2Metadata & {
    sealingPair: {
      privateKey: string;
      publicKey: string;
    };
  };

/**
 * A type representing the PermissionV2 struct that is passed to PermissionedV2.sol to grant encrypted data access.
 */
export type PermissionV2 = Expand<
  Omit<PermitV2Interface, "name" | "type" | "sealingPair"> & {
    sealingKey: string;
  }
>;

// Utils
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
