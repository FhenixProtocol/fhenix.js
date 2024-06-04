"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAddress = exports.toBeArray = exports.toBigInt = exports.bytesToNumber = exports.numberToBytes = exports.toHexString = exports.fromHexString = exports.ValidateUintInRange = void 0;
const buffer_1 = require("buffer");
const ethers_1 = require("ethers");
const validation_1 = require("./validation");
const ValidateUintInRange = (value, max, min) => {
    (0, validation_1.isNumber)(value);
    if (value > max || value < min) {
        throw new Error(`Value out of range: ${max} - ${min}, try a different uint type`);
    }
};
exports.ValidateUintInRange = ValidateUintInRange;
const fromHexString = (hexString) => {
    const cleanString = hexString.length % 2 === 1 ? `0${hexString}` : hexString;
    const arr = cleanString.replace(/^0x/, "").match(/.{1,2}/g);
    if (!arr)
        return new Uint8Array();
    return new Uint8Array(arr.map((byte) => parseInt(byte, 16)));
};
exports.fromHexString = fromHexString;
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
exports.toHexString = toHexString;
const numberToBytes = (uint32Value) => {
    const byteArrayLength = Math.ceil(Math.log2(uint32Value + 1) / 8);
    const byteArray = new Uint8Array(byteArrayLength);
    for (let i = byteArrayLength - 1; i >= 0; i--) {
        byteArray[i] = uint32Value & 0xff;
        uint32Value >>= 8;
    }
    return byteArray;
};
exports.numberToBytes = numberToBytes;
const bytesToNumber = function (byteArray) {
    if (!byteArray || (byteArray === null || byteArray === void 0 ? void 0 : byteArray.length) === 0) {
        return 0;
    }
    const length = byteArray.length;
    const buffer = buffer_1.Buffer.from(byteArray);
    const result = buffer.readUIntBE(0, length);
    return result;
};
exports.bytesToNumber = bytesToNumber;
function toBigInt(value) {
    return (0, ethers_1.toBigInt)(value);
}
exports.toBigInt = toBigInt;
function toBeArray(value) {
    return (0, ethers_1.toBeArray)(value);
}
exports.toBeArray = toBeArray;
function isAddress(address) {
    if (!(0, ethers_1.isAddress)(address)) {
        throw new Error(`Address ${address} is not valid EVM address`);
    }
}
exports.isAddress = isAddress;
//# sourceMappingURL=utils.js.map