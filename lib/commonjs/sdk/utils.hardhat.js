"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardhatMockEncrypt = exports.hardhatMockUnseal = exports.chainIsHardhat = void 0;
const utils_1 = require("./utils");
// HARDHAT MOCKS
// Mock FHE operations are automatically injected on the hardhat network
// The utility functions allow the client / sdk to interact with the mocked FHE ops
const chainIsHardhat = (chainId) => {
    if (chainId == null)
        return false;
    return parseInt(chainId) === 31337;
};
exports.chainIsHardhat = chainIsHardhat;
const hardhatMockUnseal = (value) => {
    let result = BigInt(0);
    for (const byteArrayItem of (0, utils_1.stringToUint8Array)(value)) {
        result = (result << BigInt(8)) + BigInt(byteArrayItem);
    }
    return result;
};
exports.hardhatMockUnseal = hardhatMockUnseal;
const hardhatMockEncrypt = (value, securityZone = 0) => ({
    data: (0, utils_1.bigintToUint8Array)(BigInt(value)),
    securityZone: securityZone || 0,
});
exports.hardhatMockEncrypt = hardhatMockEncrypt;
//# sourceMappingURL=utils.hardhat.js.map