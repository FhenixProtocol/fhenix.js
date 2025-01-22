import { bigintToUint8Array, stringToUint8Array } from "./utils";
// HARDHAT MOCKS
// Mock FHE operations are automatically injected on the hardhat network
// The utility functions allow the client / sdk to interact with the mocked FHE ops
export const chainIsHardhat = (chainId) => {
    if (chainId == null)
        return false;
    return parseInt(chainId) === 31337;
};
export const hardhatMockUnseal = (value) => {
    let result = BigInt(0);
    for (const byteArrayItem of stringToUint8Array(value)) {
        result = (result << BigInt(8)) + BigInt(byteArrayItem);
    }
    return result;
};
export const hardhatMockEncrypt = (value, securityZone = 0) => ({
    data: bigintToUint8Array(BigInt(value)),
    securityZone: securityZone || 0,
});
//# sourceMappingURL=utils.hardhat.js.map