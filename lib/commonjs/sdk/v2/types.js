"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultOk = exports.ResultErr = exports.isSealedAddress = exports.isSealedUint = exports.isSealedBool = exports.getAsSealedItem = exports.isEncryptableItem = exports.Encryptable = exports.FheAllUTypes = exports.FheUintUTypes = exports.FheUType = void 0;
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
    bool: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.bool }),
    uint8: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.uint8 }),
    uint16: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.uint16 }),
    uint32: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.uint32 }),
    uint64: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.uint64 }),
    uint128: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.uint128 }),
    uint256: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.uint256 }),
    address: (data, securityZone = 0) => ({ data, securityZone, utype: FheUType.address }),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEncryptableItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        ["string", "number", "bigint", "boolean"].includes(typeof value.data) &&
        typeof value.securityZone === "number" &&
        exports.FheAllUTypes.includes(value.utype));
}
exports.isEncryptableItem = isEncryptableItem;
// Determine if `value` is an instance of a `sealedItem` { data: string, utype: 0-5 | 12 | 13 }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAsSealedItem(value) {
    if (Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === "string" &&
        exports.FheAllUTypes.includes(parseInt(`${value[1]}`)))
        return {
            data: value[0],
            utype: value[1],
        };
    if (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        exports.FheAllUTypes.includes(value.utype))
        return value;
    return undefined;
}
exports.getAsSealedItem = getAsSealedItem;
function isSealedBool(value) {
    return parseInt(`${value.utype}`) === FheUType.bool;
}
exports.isSealedBool = isSealedBool;
function isSealedUint(value) {
    return exports.FheUintUTypes.includes(parseInt(`${value.utype}`));
}
exports.isSealedUint = isSealedUint;
function isSealedAddress(value) {
    return parseInt(`${value.utype}`) === FheUType.address;
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