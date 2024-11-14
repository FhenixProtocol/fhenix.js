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
exports.FhenixClientSync = exports.FhenixClient = void 0;
const fhe_js_1 = require("./fhe/fhe.js");
const utils_js_1 = require("./utils.js");
const types_js_1 = require("./types.js");
const index_js_1 = require("../extensions/access_control/index.js");
const consts_js_1 = require("./consts.js");
const tfheEncrypt = __importStar(require("./encrypt.js"));
const validation_js_1 = require("./validation.js");
const init_js_1 = require("./init.js");
class FhenixClientBase {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        this.permits = {};
        (0, validation_js_1.isPlainObject)(params);
        const { provider } = params;
        this.provider = provider;
        if (!this.provider) {
            throw new Error("Failed to initialize Fhenix Client - must include a web3 provider");
        }
    }
    // Unsealing Method
    /**
     * Unseals an encrypted message using the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} ciphertext - The encrypted message to unseal.
     * @param {string} account - The account attached to existing permits.
     * @returns bigint - The unsealed message.
     */
    unseal(contractAddress, ciphertext, account) {
        (0, utils_js_1.isAddress)(contractAddress);
        (0, validation_js_1.isString)(ciphertext);
        const permit = this.getPermit(contractAddress, account);
        if (permit == null) {
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
            const permit = yield (0, index_js_1.generatePermit)(contractAddress, provider || this.provider, signer);
            // Permit has already been put into local storage, it can be inserted directly into `this.permits`
            this.permits[contractAddress] = permit;
            return permit;
        });
    }
    /**
     * Reusable permit loading and storing from local storage
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit | undefined} - The permit loaded from local storage
     */
    _loadPermitFromLocalStorage(contractAddress, account) {
        const fromLs = (0, index_js_1.getPermitFromLocalstorage)(contractAddress, account);
        if (fromLs == null)
            return undefined;
        this.permits[contractAddress] = fromLs;
        return fromLs;
    }
    /**
     * Retrieves the stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit} - The permit associated with the contract address.
     */
    getPermit(contractAddress, account) {
        const permitFromLs = this._loadPermitFromLocalStorage(contractAddress, account);
        if (permitFromLs != null)
            return permitFromLs;
        return this.permits[contractAddress];
    }
    /**
     * Retrieves all stored permits for a specific account.
     * @param {string} account - The address of the user account.
     * @returns {Record<string, Permit>} - The permits associated with each contract address.
     */
    loadAllPermitsFromLocalStorage(account) {
        const existingPermits = (0, index_js_1.getAllExistingPermits)(account);
        Object.keys(existingPermits).forEach((contractAddress) => {
            this.permits[contractAddress] = existingPermits[contractAddress];
        });
        return this.permits;
    }
    /**
     * Stores a permit for a specific contract address. Will overwrite any existing permit for the same contract address.
     * Does not store the permit in localstorage (should it?)
     * @param {Permit} permit - The permit to store.
     */
    storePermit(permit, account) {
        (0, index_js_1.storePermitInLocalStorage)(permit, account);
        this.permits[permit.contractAddress] = permit;
    }
    /**
     * Removes a stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The account address of the permit.
     */
    removePermit(contractAddress, account) {
        if (this.hasPermit(contractAddress, account)) {
            (0, index_js_1.removePermitFromLocalstorage)(contractAddress, account);
            delete this.permits[contractAddress];
        }
    }
    /**
     * Checks if a permit exists for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The account address attached to the stored permits
     * @returns {boolean} - True if a permit exists, false otherwise.
     */
    hasPermit(contractAddress, account) {
        const permitFromLs = this._loadPermitFromLocalStorage(contractAddress, account);
        if (permitFromLs != null)
            return true;
        return this.permits[contractAddress] != null;
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
    static getFheKeyFromProvider(provider_1) {
        return __awaiter(this, arguments, void 0, function* (provider, securityZone = 0) {
            const requestMethod = (0, types_js_1.determineRequestMethod)(provider);
            const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
            const callData = funcSig + (0, utils_js_1.toABIEncodedUint32)(securityZone);
            const callParams = [{ to: consts_js_1.FheOpsAddress, data: callData }, "latest"];
            const publicKeyP = requestMethod(provider, "eth_call", callParams).catch((err) => {
                throw Error(`Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(err)}`);
            });
            const publicKey = yield publicKeyP;
            if (typeof publicKey !== "string") {
                throw new Error("Error using publicKey from provider: expected string");
            }
            if (publicKey.length < consts_js_1.PUBLIC_KEY_LENGTH_MIN) {
                throw new Error(`Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`);
            }
            // magically know how to decode rlp or w/e returns from the evm json-rpc
            const buff = (0, utils_js_1.fromHexString)(publicKey.slice(130));
            try {
                return fhe_js_1.TfheCompactPublicKey.deserialize(buff);
            }
            catch (err) {
                throw new Error(`Error deserializing public key ${err}`);
            }
        });
    }
}
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
class FhenixClient extends FhenixClientBase {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        super(params);
        this.defaultSecurityZone = 0;
        this.fhePublicKeys = [];
        (0, init_js_1.InitFhevm)().catch((err) => {
            if (params.ignoreErrors) {
                return undefined;
            }
            else {
                throw new Error(`Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
            }
        });
        // In the future the default array can be updated to include additional security zones
        // This is not strictly necessary, as the pubKey for additional zones can also be fetched during an encryption.
        // By default, doesn't skip fetching the public key
        if (params.skipPubKeyFetch !== true) {
            this.fhePublicKeys = [this.defaultSecurityZone].map((securityZone) => FhenixClientBase.getFheKeyFromProvider(params.provider, securityZone));
        }
    }
    _getPublicKey(securityZone) {
        return __awaiter(this, void 0, void 0, function* () {
            let fhePublicKey = yield this.fhePublicKeys[securityZone];
            if (!fhePublicKey) {
                this.fhePublicKeys[securityZone] = FhenixClientBase.getFheKeyFromProvider(this.provider, securityZone);
                fhePublicKey = yield this.fhePublicKeys[securityZone];
                if (!fhePublicKey) {
                    throw new Error(`Public key for security zone ${securityZone} somehow not initialized`);
                }
            }
            return fhePublicKey;
        });
    }
    encrypt_bool(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            const fhePublicKey = yield this._getPublicKey(securityZone);
            return tfheEncrypt.encrypt_bool(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint8(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            (0, validation_js_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT8, 0);
            return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint16(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            (0, validation_js_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT16, 0);
            return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint32(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            (0, validation_js_1.isNumber)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT32, 0);
            return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint64(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint128(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
        });
    }
    encrypt_uint256(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
        });
    }
    encrypt_address(value_1) {
        return __awaiter(this, arguments, void 0, function* (value, securityZone = 0) {
            (0, validation_js_1.isBigIntOrHexString)(value);
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // ValidateUintInRange(value, MAX_UINT64, 0);
            return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
        });
    }
    encrypt(value_1, type_1) {
        return __awaiter(this, arguments, void 0, function* (value, type, securityZone = 0) {
            (0, validation_js_1.isNumber)(value);
            let outputSize = type;
            const fhePublicKey = yield this._getPublicKey(securityZone);
            // choose the most efficient ciphertext size if not selected
            if (!outputSize) {
                if (value < consts_js_1.MAX_UINT8) {
                    outputSize = types_js_1.EncryptionTypes.uint8;
                }
                else if (value < consts_js_1.MAX_UINT16) {
                    outputSize = types_js_1.EncryptionTypes.uint16;
                }
                else if (value < consts_js_1.MAX_UINT32) {
                    outputSize = types_js_1.EncryptionTypes.uint32;
                }
                else {
                    throw new Error(`Encryption input must be smaller than ${consts_js_1.MAX_UINT32}`);
                }
            }
            switch (outputSize) {
                case types_js_1.EncryptionTypes.uint8:
                    (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT8, 0);
                    break;
                case types_js_1.EncryptionTypes.uint16:
                    (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT16, 0);
                    break;
                case types_js_1.EncryptionTypes.uint32:
                    (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT32, 0);
                    break;
                default:
            }
            return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
        });
    }
}
exports.FhenixClient = FhenixClient;
/**
 * The FhenixClientSync class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 *
 * The Sync FhenixClient allows the `client.encrypt_<xxxx>()` functions to be performed synchronously
 *
 * @Note The Sync FhenixClient must be created using `await FhenixClientSync.create({provider})` instead of `new FhenixClient({provider})`
 */
class FhenixClientSync extends FhenixClientBase {
    constructor(params) {
        super(params);
        this.fhePublicKeys = [];
        this.fhePublicKeys = params.fhePublicKeys;
    }
    static create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_js_1.isPlainObject)(params);
            if (params.skipPubKeyFetch === true) {
                console.warn("warning: FhenixClientSync doesn't support skipping public key fetching on creation");
            }
            const { provider, ignoreErrors, securityZones = [0] } = params;
            if (!provider) {
                throw new Error("Failed to initialize Fhenix Client - must include a web3 provider");
            }
            yield (0, init_js_1.InitFhevm)().catch((err) => {
                if (ignoreErrors) {
                    return undefined;
                }
                else {
                    throw new Error(`Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
                }
            });
            const fhePublicKeys = yield Promise.all(securityZones.map((securityZone) => FhenixClientBase.getFheKeyFromProvider(params.provider, securityZone)));
            return new FhenixClientSync(Object.assign(Object.assign({}, params), { fhePublicKeys }));
        });
    }
    // Encryption Methods
    _getPublicKey(securityZone) {
        const fhePublicKey = this.fhePublicKeys[securityZone];
        if (!fhePublicKey) {
            throw new Error(`Public key for security zone ${securityZone} not initialized`);
        }
        return fhePublicKey;
    }
    encrypt_bool(value, securityZone = 0) {
        const fhePublicKey = this._getPublicKey(securityZone);
        return tfheEncrypt.encrypt_bool(value, fhePublicKey, securityZone);
    }
    encrypt_uint8(value, securityZone = 0) {
        (0, validation_js_1.isNumber)(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT8, 0);
        return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
    }
    encrypt_uint16(value, securityZone = 0) {
        (0, validation_js_1.isNumber)(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT16, 0);
        return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
    }
    encrypt_uint32(value, securityZone = 0) {
        (0, validation_js_1.isNumber)(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT32, 0);
        return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
    }
    encrypt_uint64(value, securityZone = 0) {
        (0, validation_js_1.isBigIntOrHexString)(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
    }
    encrypt_uint128(value, securityZone = 0) {
        (0, validation_js_1.isBigIntOrHexString)(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
    }
    encrypt_uint256(value, securityZone = 0) {
        (0, validation_js_1.isBigIntOrHexString)(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
    }
    encrypt_address(value, securityZone = 0) {
        (0, validation_js_1.isBigIntOrHexString)(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
    }
    encrypt(value, type, securityZone = 0) {
        (0, validation_js_1.isNumber)(value);
        let outputSize = type;
        const fhePublicKey = this._getPublicKey(securityZone);
        // choose the most efficient ciphertext size if not selected
        if (!outputSize) {
            if (value < consts_js_1.MAX_UINT8) {
                outputSize = types_js_1.EncryptionTypes.uint8;
            }
            else if (value < consts_js_1.MAX_UINT16) {
                outputSize = types_js_1.EncryptionTypes.uint16;
            }
            else if (value < consts_js_1.MAX_UINT32) {
                outputSize = types_js_1.EncryptionTypes.uint32;
            }
            else {
                throw new Error(`Encryption input must be smaller than ${consts_js_1.MAX_UINT32}`);
            }
        }
        switch (outputSize) {
            case types_js_1.EncryptionTypes.uint8:
                (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT8, 0);
                break;
            case types_js_1.EncryptionTypes.uint16:
                (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT16, 0);
                break;
            case types_js_1.EncryptionTypes.uint32:
                (0, utils_js_1.ValidateUintInRange)(value, consts_js_1.MAX_UINT32, 0);
                break;
            default:
        }
        return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
    }
}
exports.FhenixClientSync = FhenixClientSync;
//# sourceMappingURL=index.js.map