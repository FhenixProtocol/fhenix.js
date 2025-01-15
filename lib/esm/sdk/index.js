import { TfheCompactPublicKey } from "./fhe/fhe.js";
import { fromHexString, isAddress, ValidateUintInRange, toABIEncodedUint32, } from "./utils.js";
import { determineRequestMethod, EncryptionTypes, } from "./types.js";
import { generatePermit, getAllExistingPermits, getPermitFromLocalstorage, parsePermit, removePermitFromLocalstorage, storePermitInLocalStorage, } from "../extensions/access_control/index.js";
import { FheOpsAddress, MAX_UINT16, MAX_UINT32, MAX_UINT8, PUBLIC_KEY_LENGTH_MIN, DEFAULT_COFHE_URL } from "./consts.js";
import * as tfheEncrypt from "./encrypt.js";
import { isBigIntOrHexString, isNumber, isPlainObject, isString, } from "./validation.js";
import { InitFhevm } from "./init.js";
class FhenixClientBase {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        this.permits = {};
        this.isCoFHE = false;
        isPlainObject(params);
        const { provider } = params;
        this.provider = provider;
        this.isCoFHE = params.cofhe == true;
        this.cofheURL = params.cofheURL ? params.cofheURL : DEFAULT_COFHE_URL;
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
        isAddress(contractAddress);
        isString(ciphertext);
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
    async generatePermit(contractAddress, provider, signer) {
        if (!provider && this.provider === undefined) {
            throw new Error("error getting provider");
        }
        const permit = await generatePermit(contractAddress, provider || this.provider, signer);
        // Permit has already been put into local storage, it can be inserted directly into `this.permits`
        this.permits[contractAddress] = permit;
        return permit;
    }
    /**
     * Reusable permit loading and storing from local storage
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The address of the user account.
     * @returns {Permit | undefined} - The permit loaded from local storage
     */
    _loadPermitFromLocalStorage(contractAddress, account) {
        const fromLs = getPermitFromLocalstorage(contractAddress, account);
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
        const existingPermits = getAllExistingPermits(account);
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
        storePermitInLocalStorage(permit, account);
        if (typeof permit.sealingKey.unseal == "undefined") {
            this.permits[permit.contractAddress] = (typeof permit == "string") ? parsePermit(permit) : parsePermit(JSON.stringify(permit));
        }
        else {
            this.permits[permit.contractAddress] = permit;
        }
    }
    /**
     * Removes a stored permit for a specific contract address.
     * @param {string} contractAddress - The address of the contract.
     * @param {string} account - The account address of the permit.
     */
    removePermit(contractAddress, account) {
        if (this.hasPermit(contractAddress, account)) {
            removePermitFromLocalstorage(contractAddress, account);
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
    static async getFheKeyFromProvider(provider, securityZone = 0) {
        const requestMethod = determineRequestMethod(provider);
        const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
        const callData = funcSig + toABIEncodedUint32(securityZone);
        const callParams = [{ to: FheOpsAddress, data: callData }, "latest"];
        const publicKeyP = requestMethod(provider, "eth_call", callParams).catch((err) => {
            throw Error(`Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(err)}`);
        });
        const publicKey = await publicKeyP;
        if (typeof publicKey !== "string") {
            throw new Error("Error using publicKey from provider: expected string");
        }
        if (publicKey.length < PUBLIC_KEY_LENGTH_MIN) {
            throw new Error(`Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`);
        }
        // magically know how to decode rlp or w/e returns from the evm json-rpc
        const buff = fromHexString(publicKey.slice(130));
        try {
            return TfheCompactPublicKey.deserialize(buff);
        }
        catch (err) {
            throw new Error(`Error deserializing public key ${err}`);
        }
    }
    /**
     * Retrieves the FHE public key from FHEOS.
     * @param {SupportedProvider} provider - The provider from which to retrieve the key.
     * @param securityZone - The security zone for which to retrieve the key (default 0).
     * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
     */
    static async getFheKeyFromFHEOS(securityZone = 0, cofheURL) {
        var publicKey = "";
        try {
            const res = await fetch(`${cofheURL}/GetNetworkPublickKey`, {
                method: 'POST',
                body: JSON.stringify({
                    SecurityZone: securityZone,
                })
            });
            const data = await res.json();
            publicKey = '0x' + data.securityZone;
        }
        catch (err) {
            console.log(err);
        }
        if (typeof publicKey !== "string") {
            throw new Error("Error using publicKey from provider: expected string");
        }
        if (publicKey.length < PUBLIC_KEY_LENGTH_MIN) {
            throw new Error(`Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`);
        }
        const buff = fromHexString(publicKey);
        try {
            return TfheCompactPublicKey.deserialize(buff);
        }
        catch (err) {
            throw new Error(`Error deserializing public key ${err}`);
        }
    }
}
/**
 * The FhenixClient class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 */
export class FhenixClient extends FhenixClientBase {
    /**
     * Creates an instance of FhenixClient.
     * Initializes the fhevm library if needed and retrieves the public key for encryption from the provider.
     * @param {InstanceParams} params - Parameters to initialize the client.
     */
    constructor(params) {
        super(params);
        this.defaultSecurityZone = 0;
        this.fhePublicKeys = [];
        InitFhevm().catch((err) => {
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
            this.fhePublicKeys = [this.defaultSecurityZone].map((securityZone) => 
            //FhenixClientBase.getFheKeyFromProvider(params.provider, securityZone),
            (params.cofhe == true) ? FhenixClientBase.getFheKeyFromFHEOS(securityZone, this.cofheURL) : FhenixClientBase.getFheKeyFromProvider(params.provider, securityZone));
        }
    }
    async _getPublicKey(securityZone) {
        let fhePublicKey = await this.fhePublicKeys[securityZone];
        if (!fhePublicKey) {
            if (this.isCoFHE == true) {
                this.fhePublicKeys[securityZone] = FhenixClientBase.getFheKeyFromFHEOS(securityZone, this.cofheURL);
            }
            else {
                this.fhePublicKeys[securityZone] = FhenixClientBase.getFheKeyFromProvider(this.provider, securityZone);
            }
            fhePublicKey = await this.fhePublicKeys[securityZone];
            if (!fhePublicKey) {
                throw new Error(`Public key for security zone ${securityZone} somehow not initialized`);
            }
        }
        return fhePublicKey;
    }
    async encrypt_bool(value, securityZone = 0) {
        const fhePublicKey = await this._getPublicKey(securityZone);
        return tfheEncrypt.encrypt_bool(value, fhePublicKey, securityZone);
    }
    async encrypt_uint8(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = await this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT8, 0);
        return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
    }
    async encrypt_uint16(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = await this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT16, 0);
        return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
    }
    async encrypt_uint32(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = await this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT32, 0);
        return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
    }
    async encrypt_uint64(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = await this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
    }
    async encrypt_uint128(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = await this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
    }
    async encrypt_uint256(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = await this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
    }
    async encrypt_address(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = await this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
    }
    async encrypt(value, type, securityZone = 0) {
        isNumber(value);
        let outputSize = type;
        const fhePublicKey = await this._getPublicKey(securityZone);
        // choose the most efficient ciphertext size if not selected
        if (!outputSize) {
            if (value < MAX_UINT8) {
                outputSize = EncryptionTypes.uint8;
            }
            else if (value < MAX_UINT16) {
                outputSize = EncryptionTypes.uint16;
            }
            else if (value < MAX_UINT32) {
                outputSize = EncryptionTypes.uint32;
            }
            else {
                throw new Error(`Encryption input must be smaller than ${MAX_UINT32}`);
            }
        }
        switch (outputSize) {
            case EncryptionTypes.uint8:
                ValidateUintInRange(value, MAX_UINT8, 0);
                break;
            case EncryptionTypes.uint16:
                ValidateUintInRange(value, MAX_UINT16, 0);
                break;
            case EncryptionTypes.uint32:
                ValidateUintInRange(value, MAX_UINT32, 0);
                break;
            default:
        }
        return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
    }
}
/**
 * The FhenixClientSync class provides functionalities to interact with a FHE (Fully Homomorphic Encryption) system.
 * It includes methods for encryption, unsealing, and managing permits.
 *
 * The Sync FhenixClient allows the `client.encrypt_<xxxx>()` functions to be performed synchronously
 *
 * @Note The Sync FhenixClient must be created using `await FhenixClientSync.create({provider})` instead of `new FhenixClient({provider})`
 */
export class FhenixClientSync extends FhenixClientBase {
    constructor(params) {
        super(params);
        this.fhePublicKeys = [];
        this.fhePublicKeys = params.fhePublicKeys;
    }
    static async create(params) {
        isPlainObject(params);
        if (params.skipPubKeyFetch === true) {
            console.warn("warning: FhenixClientSync doesn't support skipping public key fetching on creation");
        }
        const { provider, ignoreErrors, securityZones = [0] } = params;
        if (!provider) {
            throw new Error("Failed to initialize Fhenix Client - must include a web3 provider");
        }
        await InitFhevm().catch((err) => {
            if (ignoreErrors) {
                return undefined;
            }
            else {
                throw new Error(`Failed to initialize fhenixjs - is the network FHE-enabled? ${err}`);
            }
        });
        const fhePublicKeys = await Promise.all(securityZones.map((securityZone) => (params.cofhe == true) ? FhenixClientBase.getFheKeyFromFHEOS(securityZone, params.cofheURL ? params.cofheURL : DEFAULT_COFHE_URL) : FhenixClientBase.getFheKeyFromProvider(provider, securityZone)));
        return new FhenixClientSync({ ...params, fhePublicKeys });
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
        isNumber(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT8, 0);
        return tfheEncrypt.encrypt_uint8(value, fhePublicKey, securityZone);
    }
    encrypt_uint16(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT16, 0);
        return tfheEncrypt.encrypt_uint16(value, fhePublicKey, securityZone);
    }
    encrypt_uint32(value, securityZone = 0) {
        isNumber(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        ValidateUintInRange(value, MAX_UINT32, 0);
        return tfheEncrypt.encrypt_uint32(value, fhePublicKey, securityZone);
    }
    encrypt_uint64(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint64(value, fhePublicKey, securityZone);
    }
    encrypt_uint128(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint128(value, fhePublicKey, securityZone);
    }
    encrypt_uint256(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_uint256(value, fhePublicKey, securityZone);
    }
    encrypt_address(value, securityZone = 0) {
        isBigIntOrHexString(value);
        const fhePublicKey = this._getPublicKey(securityZone);
        // ValidateUintInRange(value, MAX_UINT64, 0);
        return tfheEncrypt.encrypt_address(value, fhePublicKey, securityZone);
    }
    encrypt(value, type, securityZone = 0) {
        isNumber(value);
        let outputSize = type;
        const fhePublicKey = this._getPublicKey(securityZone);
        // choose the most efficient ciphertext size if not selected
        if (!outputSize) {
            if (value < MAX_UINT8) {
                outputSize = EncryptionTypes.uint8;
            }
            else if (value < MAX_UINT16) {
                outputSize = EncryptionTypes.uint16;
            }
            else if (value < MAX_UINT32) {
                outputSize = EncryptionTypes.uint32;
            }
            else {
                throw new Error(`Encryption input must be smaller than ${MAX_UINT32}`);
            }
        }
        switch (outputSize) {
            case EncryptionTypes.uint8:
                ValidateUintInRange(value, MAX_UINT8, 0);
                break;
            case EncryptionTypes.uint16:
                ValidateUintInRange(value, MAX_UINT16, 0);
                break;
            case EncryptionTypes.uint32:
                ValidateUintInRange(value, MAX_UINT32, 0);
                break;
            default:
        }
        return tfheEncrypt.encrypt(value, fhePublicKey, type, securityZone);
    }
}
//# sourceMappingURL=index.js.map