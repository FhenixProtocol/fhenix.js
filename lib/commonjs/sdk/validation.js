"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBigIntOrNumber = exports.isNumber = exports.isBigIntOrHexString = exports.isPlainObject = exports.isString = void 0;
function assertIs(is, expected, value) {
    if (!is) {
        throw new Error(`Expected value which is \`${expected}\`, received value of type \`${typeof value}\`.`);
    }
}
function isString(value) {
    const is = typeof value === "string";
    assertIs(is, "string", value);
}
exports.isString = isString;
function isPlainObject(value) {
    // From: https://github.com/sindresorhus/is-plain-obj/blob/main/index.js
    if (typeof value !== "object" || value === null) {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const prototype = Object.getPrototypeOf(value);
    const is = (prototype === null ||
        prototype === Object.prototype ||
        Object.getPrototypeOf(prototype) === null) &&
        !(Symbol.toStringTag in value) &&
        !(Symbol.iterator in value);
    assertIs(is, "plain object", value);
    return true;
}
exports.isPlainObject = isPlainObject;
function isBigIntOrHexString(value) {
    const is = typeof value === "bigint" || typeof value === "string";
    assertIs(is, "bigint or hex string", value);
}
exports.isBigIntOrHexString = isBigIntOrHexString;
function isNumber(value) {
    const is = typeof value === "number" && !Number.isNaN(value);
    assertIs(is, "number", value);
}
exports.isNumber = isNumber;
function isBigIntOrNumber(value) {
    const is = typeof value === "bigint";
    if (!is) {
        try {
            isNumber(value);
        }
        catch (e) {
            throw new Error(`Value ${value} is not a number or bigint: ${typeof value}`);
        }
    }
}
exports.isBigIntOrNumber = isBigIntOrNumber;
//# sourceMappingURL=validation.js.map