import { FheUType, FheAllUTypes, } from "./types";
export const Encryptable = {
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
export function isEncryptableItem(value) {
    return (typeof value === "object" &&
        value !== null &&
        ["string", "number", "bigint", "boolean"].includes(typeof value.data) &&
        typeof value.securityZone === "number" &&
        FheAllUTypes.includes(value.utype));
}
//# sourceMappingURL=encryptable.js.map