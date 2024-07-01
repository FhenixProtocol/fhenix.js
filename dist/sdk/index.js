"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FhenixClient = void 0;
const node_tfhe_1 = require("node-tfhe");
const utils_1 = require("./utils");
const types_1 = require("./types");
const access_control_1 = require("../extensions/access_control");
const ethers_1 = require("ethers");
const consts_1 = require("./consts");
const tfheEncrypt = __importStar(require("./encrypt"));
const validation_1 = require("./validation");
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
class FhenixClient {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        this.permits = {};
        this.defaultSecurityZone = 0;
        this.fhePublicKeys = [];
        (0, validation_1.isPlainObject)(params);
        if ((params === null || params === void 0 ? void 0 : params.provider) === undefined) {
            params.provider = new ethers_1.JsonRpcProvider("http://localhost:8545");
        }
        const { provider, ignoreErrors } = params;
        this.provider = provider;
        // in most cases we will want to init the fhevm library - except if this is used outside of the browser, in which
        // case this should be called with initSdk = false (tests, for instance)
        /// #if DEBUG
        this.fhePublicKeys[this.defaultSecurityZone] = FhenixClient.getFheKeyFromProvider(this.provider).catch((err) => {
            if (ignoreErrors) {
                return undefined;
            }
            else {
                throw new Error(`Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
            }
        });
        /// #else
        const asyncInitFhevm = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { initFhevm } = yield Promise.resolve().then(() => __importStar(require("./init")));
                yield initFhevm();
            }
            catch (err) {
                throw new Error(`Error initializing FhenixClient - maybe try calling with initSdk: false. ${err}`);
            }
        });
        if ((params === null || params === void 0 ? void 0 : params.initSdk) !== false) {
            this.fhePublicKeys[this.defaultSecurityZone] = asyncInitFhevm().then(() => FhenixClient.getFheKeyFromProvider(provider));
        }
        /// #endif
    }
    // Encryption Methods
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedBool} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    encrypt_bool(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const fhePublicKey = yield this._getPublicKey(securityZone);
            return tfheEncrypt.encrypt_bool(value, fhePublicKey, securityZone);
        });
    }
    /**
     * Encrypts a Uint8 value using the stored public key.
     * @param {number} value - The Uint8 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint8} - The encrypted value serialized as EncryptedUint8. Use the .data property to access the Uint8Array.
     */
    encrypt_uint8(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            (0, utils_1.ValidateUintInRange)(value, consts_1.MAX_UINT8, 0);
            return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
        });
    }
    _getPublicKey(securityZone) {
        return __awaiter(this, void 0, void 0, function* () {
            let fhePublicKey = yield this.fhePublicKeys[securityZone];
            if (!fhePublicKey) {
                this.fhePublicKeys[securityZone] = FhenixClient.getFheKeyFromProvider(this.provider, securityZone);
                fhePublicKey = yield this.fhePublicKeys[securityZone];
                if (!fhePublicKey) {
                    throw new Error(`Public key for security zone ${securityZone} somehow not initialized`);
                }
            }
            return fhePublicKey;
        });
    }
    /**
     * Encrypts a Uint16 value using the stored public key.
     * @param {number} value - The Uint16 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint16} - The encrypted value serialized as EncryptedUint16. Use the .data property to access the Uint8Array.
     */
    encrypt_uint16(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            (0, utils_1.ValidateUintInRange)(value, consts_1.MAX_UINT16, 0);
            return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
        });
    }
    /**
     * Encrypts a Uint32 value using the stored public key.
     * @param {number} value - The Uint32 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint32} - The encrypted value serialized as EncryptedUint32. Use the .data property to access the Uint8Array.
     */
    encrypt_uint32(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            (0, utils_1.ValidateUintInRange)(value, consts_1.MAX_UINT32, 0);
            return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
        });
    }
    /**
     * Encrypts a Uint64 value using the stored public key.
     * @param {bigint | string} value - The Uint32 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint64} - The encrypted value serialized as EncryptedUint64. Use the .data property to access the Uint8Array.
     */
    encrypt_uint64(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
        });
    }
    /**
     * Encrypts a Uint128 value using the stored public key.
     * @param {bigint | string} value - The Uint128 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint128} - The encrypted value serialized as EncryptedUint128. Use the .data property to access the Uint8Array.
     */
    encrypt_uint128(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
        });
    }
    /**
     * Encrypts a Uint256 value using the stored public key.
     * @param {bigint | string} value - The Uint256 value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedUint256} - The encrypted value serialized as EncryptedUint256. Use the .data property to access the Uint8Array.
     */
    encrypt_uint256(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
        });
    }
    /**
     * Encrypts an Address (Uint160) value using the stored public key.
     * @param {bigint | string} value - The Address (Uint160) value to encrypt.
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedAddress} - The encrypted value serialized as EncryptedAddress. Use the .data property to access the Uint8Array.
     */
    encrypt_address(value, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
        });
    }
    /**
     * Encrypts a numeric value according to the specified encryption type or the most efficient one based on the value.
     * @param {number} value - The numeric value to encrypt.
     * @param {EncryptionTypes} type - Optional. The encryption type (uint8, uint16, uint32).
     * @param securityZone - The security zone for which to encrypt the value (default 0).
     * @returns {EncryptedNumber} - The encrypted value serialized as Uint8Array. Use the .data property to access the Uint8Array.
     */
    encrypt(value, type, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.isNumber)(value);
            let outputSize = type;
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // choose the most efficient ciphertext size if not selected
            if (!outputSize) {
                if (value < consts_1.MAX_UINT8) {
                    outputSize = types_1.EncryptionTypes.uint8;
                }
                else if (value < consts_1.MAX_UINT16) {
                    outputSize = types_1.EncryptionTypes.uint16;
                }
                else if (value < consts_1.MAX_UINT32) {
                    outputSize = types_1.EncryptionTypes.uint32;
                }
                else {
                    throw new Error(`Encryption input must be smaller than ${consts_1.MAX_UINT32}`);
                }
            }
            switch (outputSize) {
                case types_1.EncryptionTypes.uint8:
                    (0, utils_1.ValidateUintInRange)(value, consts_1.MAX_UINT8, 0);
                    break;
                case types_1.EncryptionTypes.uint16:
                    (0, utils_1.ValidateUintInRange)(value, consts_1.MAX_UINT16, 0);
                    break;
                case types_1.EncryptionTypes.uint32:
                    (0, utils_1.ValidateUintInRange)(value, consts_1.MAX_UINT32, 0);
                    break;
                default:
            }
            return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
        });
    }
    // Unsealing Method
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @returns bigint - The unsealed message.
     */
    unseal(contractAddress, ciphertext) {
        (0, utils_1.isAddress)(contractAddress);
        (0, validation_1.isString)(ciphertext);
        if (!this.hasPermit(contractAddress)) {
            throw new Error(`Missing keypair for ${contractAddress}`);
        }
        return this.permits[contractAddress].sealingKey.unseal(ciphertext);
    }
    // Permit Management Methods
    /**
     * Creates a new permit for a specific contract address. Also saves the permit to localstorage (if available)
     * @param {string} contractAddress - The address of the contract.
     * @param {SupportedProvider} provider - The provider from which to sign the permit - must container a signer.
     * @param signer - the signer to use to sign the permit if provider does not support signing (e.g. hardhat)
     * @returns Permit - The permit associated with the contract address.
     *
     * @throws {Error} - If the provider does not contain a signer, or if a provider is not set
     */
    generatePermit(contractAddress, provider, signer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!provider && this.provider === undefined) {
                throw new Error("error getting provider");
            }
            const permit = yield (0, access_control_1.generatePermit)(contractAddress, provider || this.provider, signer);
            this.storePermit(permit);
            return permit;
        });
    }
    /**
     * Retrieves the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit} - The permit associated with the contract address.
     */
    getPermit(contractAddress, account) {
        const fromLs = (0, access_control_1.getPermitFromLocalstorage)(contractAddress, account);
        if (fromLs) {
            this.permits[contractAddress] = fromLs;
            return fromLs;
        }
        if (!this.hasPermit(contractAddress)) {
            return undefined;
        }
        return this.permits[contractAddress];
    }
    /**
     * Stores a permit for a specific contract address. Will overwrite any existing permit for the same contract address.
     * Does not store the permit in localstorage (should it?)
     * @param {Permit} permit - The permit to store.
     */
    storePermit(permit) {
        this.permits[permit.contractAddress] = permit;
    }
    /**
     * Removes a stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     */
    removePermit(contractAddress) {
        if (this.hasPermit(contractAddress)) {
            delete this.permits[contractAddress];
        }
    }
    /**
     * Checks if a permit exists for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @returns {boolean} - True if a permit exists, false otherwise.
     */
    hasPermit(contractAddress) {
        return this.permits[contractAddress] !== null;
    }
    /**
     * Exports all stored permits.
     * @returns {ContractPermits} - All stored permits.
     */
    exportPermits() {
        return this.permits;
    }
    extractPermitPermission(permit) {
        return {
            signature: permit.signature,
            publicKey: permit.publicKey,
        };
    }
    // Private helper methods
    /**
     * Retrieves the FHE public key from the provider.
     * @param {SupportedProvider} provider - The provider from which to retrieve the key.
     * @param securityZone - The security zone for which to retrieve the key (default 0).
     * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
     */
    static getFheKeyFromProvider(provider, securityZone = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestMethod = (0, types_1.determineRequestMethod)(provider);
            const chainIdP = requestMethod(provider, "eth_chainId").catch((err) => {
                throw Error(`Error while requesting chainId from provider: ${err}`);
            });
            const networkPkAbi = new ethers_1.Interface(["function getNetworkPublicKey(int32 securityZone)"]);
            const callData = networkPkAbi.encodeFunctionData("getNetworkPublicKey", [securityZone]);
            const callParams = [{ to: consts_1.FheOpsAddress, data: callData }, "latest"];
            const publicKeyP = requestMethod(provider, "eth_call", callParams).catch((err) => {
                throw Error(`Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(err)}`);
            });
            const [chainId, publicKey] = yield Promise.all([chainIdP, publicKeyP]);
            const chainIdNum = parseInt(chainId, 16);
            if (isNaN(chainIdNum)) {
                throw new Error(`received non-hex number from chainId request: "${chainId}"`);
            }
            if (typeof publicKey !== "string") {
                throw new Error("Error using publicKey from provider: expected string");
            }
            if (publicKey.length < consts_1.PUBLIC_KEY_LENGTH_MIN) {
                throw new Error(`Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`);
            }
            const abiCoder = ethers_1.AbiCoder.defaultAbiCoder();
            const publicKeyDecoded = abiCoder.decode(["bytes"], publicKey)[0];
            const buff = (0, utils_1.fromHexString)(publicKeyDecoded);
            try {
                return node_tfhe_1.TfheCompactPublicKey.deserialize(buff);
            }
            catch (err) {
                throw new Error(`Error deserializing public key: did you initialize fhenix.js with "initFhevm()"? ${err}`);
            }
        });
    }
}
exports.FhenixClient = FhenixClient;
//# sourceMappingURL=index.js.map