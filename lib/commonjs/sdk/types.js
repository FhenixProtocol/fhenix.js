"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineRequestSigner = exports.determineRequestMethod = exports.EncryptionTypes = void 0;
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
 * Determines the request method for a given provider.
 * Checks if the provider has a 'request' method typical for Eip1193Providers, or a 'send' method for others.
 * Throws an error if neither method is found.
 * @param {SupportedProvider} provider - The provider to determine the request method for.
 * @returns {Function} - The determined request function.
 */
// eslint-disable-next-line  @typescript-eslint/ban-types
function determineRequestMethod(provider) {
    if ("request" in provider && typeof provider.request === "function") {
        return (p, method, params) => p.request({ method, params });
    }
    else if ("send" in provider && typeof provider.send === "function") {
        return (p, method, params) => p.send(method, params);
    }
    else {
        throw new Error("Received unsupported provider. 'send' or 'request' method not found");
    }
}
exports.determineRequestMethod = determineRequestMethod;
/**
 * Determines the request signer function for a given provider.
 * Checks if the provider has a 'getSigner' method and returns it if available.
 * Throws an error if no 'getSigner' method is found.
 * @param {SupportedProvider} provider - The provider to determine the request signer for.
 * @returns {Function} - The determined request signer function.
 */
// eslint-disable-next-line  @typescript-eslint/ban-types
function determineRequestSigner(provider) {
    if ("getSigner" in provider && typeof provider.getSigner === "function") {
        return (p) => p.getSigner();
    }
    else {
        throw new Error("The supplied provider cannot get a signer");
    }
}
exports.determineRequestSigner = determineRequestSigner;
//# sourceMappingURL=types.js.map