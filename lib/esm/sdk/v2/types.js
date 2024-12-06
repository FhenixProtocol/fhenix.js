export var FheUType;
(function (FheUType) {
    FheUType[FheUType["bool"] = 13] = "bool";
    FheUType[FheUType["uint8"] = 0] = "uint8";
    FheUType[FheUType["uint16"] = 1] = "uint16";
    FheUType[FheUType["uint32"] = 2] = "uint32";
    FheUType[FheUType["uint64"] = 3] = "uint64";
    FheUType[FheUType["uint128"] = 4] = "uint128";
    FheUType[FheUType["uint256"] = 5] = "uint256";
    FheUType[FheUType["address"] = 12] = "address";
})(FheUType || (FheUType = {}));
export const FheUintUTypes = [
    FheUType.uint8,
    FheUType.uint16,
    FheUType.uint32,
    FheUType.uint64,
    FheUType.uint128,
    FheUType.uint256,
];
export const FheAllUTypes = [
    FheUType.bool,
    FheUType.uint8,
    FheUType.uint16,
    FheUType.uint32,
    FheUType.uint64,
    FheUType.uint128,
    FheUType.uint256,
    FheUType.address,
];
export const Encryptable = {
    bool: (data, securityZone) => ({ data, securityZone, utype: FheUType.bool }),
    uint8: (data, securityZone) => ({ data, securityZone, utype: FheUType.uint8 }),
    uint16: (data, securityZone) => ({ data, securityZone, utype: FheUType.uint16 }),
    uint32: (data, securityZone) => ({ data, securityZone, utype: FheUType.uint32 }),
    uint64: (data, securityZone) => ({ data, securityZone, utype: FheUType.uint64 }),
    uint128: (data, securityZone) => ({ data, securityZone, utype: FheUType.uint128 }),
    uint256: (data, securityZone) => ({ data, securityZone, utype: FheUType.uint256 }),
    address: (data, securityZone) => ({ data, securityZone, utype: FheUType.address }),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEncryptableItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        typeof value.securityZone === "number" &&
        FheAllUTypes.includes(value.utype));
}
// Type guard for any SealedItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSealedItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        FheAllUTypes.includes(value.utype));
}
// Type guard for SealedBool
export function isSealedBool(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        value.utype === FheUType.bool);
}
// Type guard for SealedUint
export function isSealedUint(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        FheUintUTypes.includes(value.utype));
}
// Type guard for SealedAddress
export function isSealedAddress(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        value.utype === FheUType.address);
}
export const ResultErr = (error) => ({
    success: false,
    data: null,
    error,
});
export const ResultOk = (data) => ({
    success: true,
    data,
    error: null,
});
//# sourceMappingURL=types.js.map