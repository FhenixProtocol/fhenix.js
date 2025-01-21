import { FheAllUTypes, FheUintUTypes, FheUType } from "./types";
// Determine if `value` is an instance of a `sealedItem` { data: string, utype: 0-5 | 12 | 13 }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAsSealedItem(value) {
    if (Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === "string" &&
        FheAllUTypes.includes(parseInt(`${value[1]}`)))
        return {
            data: value[0],
            utype: value[1],
        };
    if (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        FheAllUTypes.includes(value.utype))
        return value;
    return undefined;
}
export function isSealedBool(value) {
    return parseInt(`${value.utype}`) === FheUType.bool;
}
export function isSealedUint(value) {
    return FheUintUTypes.includes(parseInt(`${value.utype}`));
}
export function isSealedAddress(value) {
    return parseInt(`${value.utype}`) === FheUType.address;
}
//# sourceMappingURL=sealed.js.map