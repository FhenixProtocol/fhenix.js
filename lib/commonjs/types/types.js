"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FheAllUTypes = exports.FheUintUTypes = exports.FheUType = exports.EncryptionTypes = void 0;
/**
 * An enumeration of supported encryption types.
 * uint8, uint16, and uint32 represent the different sizes of integers that can be encrypted.
 */
var EncryptionTypes;
(function (EncryptionTypes) {
    EncryptionTypes["bool"] = "bool";
    EncryptionTypes["uint8"] = "uint8";
    EncryptionTypes["uint16"] = "uint16";
    EncryptionTypes["uint32"] = "uint32";
    EncryptionTypes["uint64"] = "uint64";
    EncryptionTypes["uint128"] = "uint128";
    EncryptionTypes["uint256"] = "uint256";
    EncryptionTypes["address"] = "address";
})(EncryptionTypes || (exports.EncryptionTypes = EncryptionTypes = {}));
/**
 * Mapping of encryption types to their utype integer
 */
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
/**
 * List of All FHE uint types (excludes bool and address)
 */
exports.FheUintUTypes = [
    FheUType.uint8,
    FheUType.uint16,
    FheUType.uint32,
    FheUType.uint64,
    FheUType.uint128,
    FheUType.uint256,
];
/**
 * List of All FHE types (uints, bool, and address)
 */
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
//# sourceMappingURL=types.js.map