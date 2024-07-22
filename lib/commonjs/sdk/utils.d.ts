export declare const ValidateUintInRange: (value: number, max: number, min: number) => void;
export declare const fromHexString: (hexString: string) => Uint8Array;
export declare const toHexString: (bytes: Uint8Array) => string;
export declare function toBigInt(value: Uint8Array): bigint;
export declare function toBeArray(value: bigint | number): Uint8Array;
export declare function isAddress(address: string): void;
export declare function toABIEncodedUint32(value: number): string;
//# sourceMappingURL=utils.d.ts.map