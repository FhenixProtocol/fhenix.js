import { Primitive, LiteralToPrimitive } from "type-fest";
import { SealingKey } from "../sealing";
import { EncryptedBool, EncryptedUint8, EncryptedUint16, EncryptedUint32, EncryptedUint64, EncryptedUint128, EncryptedUint256, EncryptedAddress } from "../types";
export declare enum FheUType {
    bool = 13,
    uint8 = 0,
    uint16 = 1,
    uint32 = 2,
    uint64 = 3,
    uint128 = 4,
    uint256 = 5,
    address = 12
}
export declare const FheUintUTypes: readonly [FheUType.uint8, FheUType.uint16, FheUType.uint32, FheUType.uint64, FheUType.uint128, FheUType.uint256];
export declare const FheAllUTypes: readonly [FheUType.bool, FheUType.uint8, FheUType.uint16, FheUType.uint32, FheUType.uint64, FheUType.uint128, FheUType.uint256, FheUType.address];
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
export declare const Encryptable: {
    readonly bool: (data: EncryptableBool["data"], securityZone?: number) => EncryptableBool;
    readonly uint8: (data: EncryptableUint8["data"], securityZone?: number) => EncryptableUint8;
    readonly uint16: (data: EncryptableUint16["data"], securityZone?: number) => EncryptableUint16;
    readonly uint32: (data: EncryptableUint32["data"], securityZone?: number) => EncryptableUint32;
    readonly uint64: (data: EncryptableUint64["data"], securityZone?: number) => EncryptableUint64;
    readonly uint128: (data: EncryptableUint128["data"], securityZone?: number) => EncryptableUint128;
    readonly uint256: (data: EncryptableUint256["data"], securityZone?: number) => EncryptableUint256;
    readonly address: (data: EncryptableAddress["data"], securityZone?: number) => EncryptableAddress;
};
export type EncryptableItem = EncryptableBool | EncryptableUint8 | EncryptableUint16 | EncryptableUint32 | EncryptableUint64 | EncryptableUint128 | EncryptableUint256 | EncryptableAddress;
export type EncryptedItemMap<E extends EncryptableItem> = E extends EncryptableBool ? EncryptedBool : E extends EncryptableUint8 ? EncryptedUint8 : E extends EncryptableUint16 ? EncryptedUint16 : E extends EncryptableUint32 ? EncryptedUint32 : E extends EncryptableUint64 ? EncryptedUint64 : E extends EncryptableUint128 ? EncryptedUint128 : E extends EncryptableUint256 ? EncryptedUint256 : E extends EncryptableAddress ? EncryptedAddress : never;
export type MappedEncryptedTypes<T> = T extends "permission" ? PermissionV2 : T extends Primitive ? LiteralToPrimitive<T> : T extends EncryptableItem ? EncryptedItemMap<T> : {
    [K in keyof T]: MappedEncryptedTypes<T[K]>;
};
export declare function isEncryptableItem(value: any): value is EncryptableItem;
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
export type UnsealedItemMap<S extends SealedItem> = S extends SealedBool ? boolean : S extends SealedUint ? bigint : S extends SealedAddress ? string : never;
export type MappedUnsealedTypes<T> = T extends Primitive ? LiteralToPrimitive<T> : T extends SealedItem ? UnsealedItemMap<T> : {
    [K in keyof T]: MappedUnsealedTypes<T[K]>;
};
export declare function isSealedItem(value: any): value is SealedItem;
export declare function isSealedBool(value: SealedItem): value is SealedBool;
export declare function isSealedUint(value: SealedItem): value is SealedUint;
export declare function isSealedAddress(value: SealedItem): value is SealedAddress;
export type Result<T, E = string> = {
    success: true;
    data: T;
    error: null;
} | {
    success: false;
    data: null;
    error: E;
};
export declare const ResultErr: <T, E>(error: E) => Result<T, E>;
export declare const ResultOk: <T, E>(data: T) => Result<T, E>;
export interface AbstractProvider {
    getChainId(): Promise<string>;
    call(tx: {
        to: string;
        data: string;
    }): Promise<string>;
}
export interface AbstractSigner {
    getAddress(): Promise<string>;
    signTypedData(domain: object, types: Record<string, Array<object>>, value: object): Promise<string>;
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
export type PickPartial<T, F extends keyof T> = Expand<Omit<T, F> & Partial<Pick<T, F>>>;
export type PermitV2Satisfiers = Expand<Pick<PermitV2Interface, "contracts" | "projects">>;
export type PermitV2Core = Expand<Pick<PermitV2Interface, "issuer"> & Partial<Pick<PermitV2Interface, "contracts" | "projects" | "recipient" | "validatorId" | "validatorContract">>>;
export type PermitV2Options = Expand<Partial<Omit<PermitV2Interface, "recipient" | "recipientSignature">> & {
    type: "self";
    issuer: string;
}> | Expand<Partial<Omit<PermitV2Interface, "recipientSignature">> & {
    type: "sharing";
    issuer: string;
    recipient: string;
}> | Expand<Partial<PermitV2Interface> & {
    type: "recipient";
    issuer: string;
    recipient: string;
    issuerSignature: string;
}>;
export type SerializedPermitV2 = Omit<PermitV2Interface, "sealingPair"> & PermitV2Metadata & {
    sealingPair: {
        privateKey: string;
        publicKey: string;
    };
};
/**
 * A type representing the PermissionV2 struct that is passed to PermissionedV2.sol to grant encrypted data access.
 */
export type PermissionV2 = Expand<Omit<PermitV2Interface, "name" | "type" | "sealingPair"> & {
    sealingKey: string;
}>;
export type Expand<T> = T extends infer O ? {
    [K in keyof O]: O[K];
} : never;
//# sourceMappingURL=types.d.ts.map