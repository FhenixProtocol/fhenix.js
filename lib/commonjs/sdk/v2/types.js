"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultOk = exports.ResultErr = exports.isSealedAddress = exports.isSealedUint = exports.isSealedBool = exports.isSealedItem = exports.isEncryptableItem = exports.Encryptable = exports.FheAllUTypes = exports.FheUintUTypes = exports.FheUType = void 0;
var FheUType;
(function (FheUType) {
    FheUType[FheUType["bool"] = 13] = "bool";
    FheUType[FheUType["uint8"] = 0] = "uint8";
    FheUType[FheUType["uint16"] = 1] = "uint16";
    FheUType[FheUType["uint32"] = 2] = "uint32";
    FheUType[FheUType["uint64"] = 3] = "uint64";
    FheUType[FheUType["uint128"] = 4] = "uint128";
    FheUType[FheUType["uint256"] = 5] = "uint256";
    FheUType[FheUType["address"] = 12] = "address";
})(FheUType || (exports.FheUType = FheUType = {}));
exports.FheUintUTypes = [
    FheUType.uint8,
    FheUType.uint16,
    FheUType.uint32,
    FheUType.uint64,
    FheUType.uint128,
    FheUType.uint256,
];
exports.FheAllUTypes = [
    FheUType.bool,
    FheUType.uint8,
    FheUType.uint16,
    FheUType.uint32,
    FheUType.uint64,
    FheUType.uint128,
    FheUType.uint256,
    FheUType.address,
];
exports.Encryptable = {
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
function isEncryptableItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        typeof value.securityZone === "number" &&
        exports.FheAllUTypes.includes(value.utype));
}
exports.isEncryptableItem = isEncryptableItem;
// Type guard for any SealedItem
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSealedItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        exports.FheAllUTypes.includes(value.utype));
}
exports.isSealedItem = isSealedItem;
// Type guard for SealedBool
function isSealedBool(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        value.utype === FheUType.bool);
}
exports.isSealedBool = isSealedBool;
// Type guard for SealedUint
function isSealedUint(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        exports.FheUintUTypes.includes(value.utype));
}
exports.isSealedUint = isSealedUint;
// Type guard for SealedAddress
function isSealedAddress(value) {
    return (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        value.utype === FheUType.address);
}
exports.isSealedAddress = isSealedAddress;
const ResultErr = (error) => ({
    success: false,
    data: null,
    error,
});
exports.ResultErr = ResultErr;
const ResultOk = (data) => ({
    success: true,
    data,
    error: null,
});
exports.ResultOk = ResultOk;
//# sourceMappingURL=types.js.map