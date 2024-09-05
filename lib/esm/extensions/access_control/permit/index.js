var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isAddress } from "../../../sdk/utils.js";
import { determineRequestMethod, determineRequestSigner, } from "../../../sdk/types.js";
import { GenerateSealingKey, SealingKey } from "../../../sdk/sealing.js";
const PERMIT_PREFIX = "Fhenix_saved_permit_";
const parsePermit = (savedPermit) => {
    const o = JSON.parse(savedPermit);
    if (o) {
        return {
            contractAddress: o.contractAddress,
            sealingKey: new SealingKey(o.sealingKey.privateKey, o.sealingKey.publicKey),
            signature: o.signature,
            publicKey: `0x${o.sealingKey.publicKey}`,
        };
    }
    throw new Error(`Cannot parse permit`);
};
export const getPermit = (contract_1, provider_1, ...args_1) => __awaiter(void 0, [contract_1, provider_1, ...args_1], void 0, function* (contract, provider, autoGenerate = true) {
    isAddress(contract);
    if (!provider) {
        throw new Error(`Missing provider`);
    }
    const getSigner = determineRequestSigner(provider);
    const signer = yield getSigner(provider);
    const savedPermit = getPermitFromLocalstorage(contract, yield signer.getAddress());
    if (savedPermit != null)
        return savedPermit;
    return autoGenerate ? generatePermit(contract, provider) : null;
});
export const getAllExistingPermits = (account) => {
    const permits = {};
    const search = new RegExp(`${PERMIT_PREFIX}(.*?)_${account}`);
    Object.keys(window.localStorage).forEach((key) => {
        const matchArray = key.match(search);
        if (matchArray == null)
            return;
        const contract = matchArray[1];
        const permitRaw = window.localStorage.getItem(key);
        if (permitRaw == null)
            return;
        try {
            const permit = parsePermit(permitRaw);
            permits[contract] = permit;
        }
        catch (err) {
            console.warn(err);
        }
    });
    return permits;
};
export const getAllPermits = () => {
    const permits = new Map();
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.includes(PERMIT_PREFIX)) {
            const contract = key.replace(PERMIT_PREFIX, "");
            // Not sure if needed, code placeholder:
            // const noPrefixPermit = key.replace(PERMIT_PREFIX, "");
            // let contract = "";
            // if (noPrefixPermit.includes("_")) {
            //   const tmp = noPrefixPermit.split("_");
            //   contract = tmp[0];
            // } else {
            //   contract = noPrefixPermit;
            // }
            try {
                const permit = parsePermit(window.localStorage.getItem(key));
                permits.set(contract, permit);
            }
            catch (err) {
                console.warn(err);
            }
        }
    }
    return permits;
};
const sign = (signer, domain, types, value) => __awaiter(void 0, void 0, void 0, function* () {
    if ("_signTypedData" in signer &&
        typeof signer._signTypedData == "function") {
        return yield signer._signTypedData(domain, types, value);
    }
    else if ("signTypedData" in signer &&
        typeof signer.signTypedData == "function") {
        return yield signer.signTypedData(domain, types, value);
    }
    throw new Error("Unsupported signer");
});
export const generatePermit = (contract, provider, customSigner) => __awaiter(void 0, void 0, void 0, function* () {
    if (!provider) {
        throw new Error("Provider is undefined");
    }
    const requestMethod = determineRequestMethod(provider);
    let signer;
    if (!customSigner) {
        const getSigner = determineRequestSigner(provider);
        signer = yield getSigner(provider);
    }
    else {
        signer = customSigner;
    }
    const chainId = yield requestMethod(provider, "eth_chainId", []);
    const keypair = yield GenerateSealingKey();
    const msgParams = {
        types: {
            // This refers to the domain the contract is hosted on.
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
            ],
            // Refer to primaryType.
            Permissioned: [{ name: "publicKey", type: "bytes32" }],
        },
        // This defines the message you're proposing the user to sign, is dapp-specific, and contains
        // anything you want. There are no required fields. Be as explicit as possible when building out
        // the message schema.
        // This refers to the keys of the following types object.
        primaryType: "Permissioned",
        domain: {
            // Give a user-friendly name to the specific contract you're signing for.
            name: "Fhenix Permission", // params.name
            // This identifies the latest version.
            version: "1.0", //params.version ||
            // This defines the network, in this case, Mainnet.
            chainId: chainId,
            // // Add a verifying contract to make sure you're establishing contracts with the proper entity.
            verifyingContract: contract, //params.verifyingContract,
        },
        message: {
            publicKey: `0x${keypair.publicKey}`,
        },
    };
    const msgSig = yield sign(signer, msgParams.domain, { Permissioned: msgParams.types.Permissioned }, msgParams.message);
    const permit = {
        contractAddress: contract,
        sealingKey: keypair,
        signature: msgSig,
        publicKey: `0x${keypair.publicKey}`,
        //permit: msgParams,
        //msgSig
    };
    storePermitInLocalStorage(permit, yield signer.getAddress());
    return permit;
});
export const removePermit = (contract, account) => {
    if (!account) {
        // Backward compatibility
        window.localStorage.removeItem(`${PERMIT_PREFIX}${contract}`);
    }
    else {
        window.localStorage.removeItem(`${PERMIT_PREFIX}${contract}_${account}`);
    }
};
export const getPermitFromLocalstorage = (contract, account) => {
    let savedPermit = null;
    if (typeof window !== "undefined" && window.localStorage) {
        savedPermit = window.localStorage.getItem(`${PERMIT_PREFIX}${contract}_${account}`);
        if (!account) {
            // Backward compatibility
            savedPermit = window.localStorage.getItem(`${PERMIT_PREFIX}${contract}`);
        }
        else {
            savedPermit = window.localStorage.getItem(`${PERMIT_PREFIX}${contract}_${account}`);
        }
    }
    if (!savedPermit) {
        return undefined;
    }
    return parsePermit(savedPermit);
};
export const storePermitInLocalStorage = (permit, account) => {
    if (typeof window !== "undefined" && window.localStorage) {
        // Sealing key is a class, and will include methods in the JSON
        const serialized = {
            contractAddress: permit.contractAddress,
            sealingKey: {
                publicKey: permit.sealingKey.publicKey,
                privateKey: permit.sealingKey.privateKey,
            },
            signature: permit.signature,
        };
        window.localStorage.setItem(`${PERMIT_PREFIX}${permit.contractAddress}_${account}`, JSON.stringify(serialized));
    }
};
export const removePermitFromLocalstorage = (contract, account) => {
    if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(`${PERMIT_PREFIX}${contract}_${account}`);
    }
};
//# sourceMappingURL=index.js.map