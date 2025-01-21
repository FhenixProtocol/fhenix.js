"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEncryptableItem = exports.Encryptable = void 0;
const types_1 = require("./types");
exports.Encryptable = {
    bool: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.bool }),
    uint8: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.uint8 }),
    uint16: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.uint16 }),
    uint32: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.uint32 }),
    uint64: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.uint64 }),
    uint128: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.uint128 }),
    uint256: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.uint256 }),
    address: (data, securityZone = 0) => ({ data, securityZone, utype: types_1.FheUType.address }),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEncryptableItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        ["string", "number", "bigint", "boolean"].includes(typeof value.data) &&
        typeof value.securityZone === "number" &&
        types_1.FheAllUTypes.includes(value.utype));
}
exports.isEncryptableItem = isEncryptableItem;
//# sourceMappingURL=encryptable.js.map