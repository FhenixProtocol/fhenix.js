"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSealedAddress = exports.isSealedUint = exports.isSealedBool = exports.getAsSealedItem = void 0;
const base_1 = require("./base");
// Determine if `value` is an instance of a `sealedItem` { data: string, utype: 0-5 | 12 | 13 }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAsSealedItem(value) {
    if (Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === "string" &&
        base_1.FheAllUTypes.includes(parseInt(`${value[1]}`)))
        return {
            data: value[0],
            utype: value[1],
        };
    if (typeof value === "object" &&
        value !== null &&
        typeof value.data === "string" &&
        base_1.FheAllUTypes.includes(value.utype))
        return value;
    return undefined;
}
exports.getAsSealedItem = getAsSealedItem;
function isSealedBool(value) {
    return parseInt(`${value.utype}`) === base_1.FheUType.bool;
}
exports.isSealedBool = isSealedBool;
function isSealedUint(value) {
    return base_1.FheUintUTypes.includes(parseInt(`${value.utype}`));
}
exports.isSealedUint = isSealedUint;
function isSealedAddress(value) {
    return parseInt(`${value.utype}`) === base_1.FheUType.address;
}
exports.isSealedAddress = isSealedAddress;
//# sourceMappingURL=sealed.js.map