import { LiteralToPrimitive, Primitive } from "type-fest";
import { FheUintUTypes, FheUType } from "./types";
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
export declare function getAsSealedItem(value: any): SealedItem | undefined;
export declare function isSealedBool(value: SealedItem): boolean;
export declare function isSealedUint(value: SealedItem): boolean;
export declare function isSealedAddress(value: SealedItem): boolean;
//# sourceMappingURL=sealed.d.ts.map