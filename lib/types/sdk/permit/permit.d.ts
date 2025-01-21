import { PermitV2SignaturePrimaryType } from "./generate";
import { SealingKey } from "../sealing";
import { AbstractSigner, PermissionV2, PermitV2Interface, PermitV2Metadata, PermitV2Options, SerializedPermitV2 } from "../../types/permit";
import { MappedUnsealedTypes } from "../../types/sealed";
export declare class PermitV2 implements PermitV2Interface, PermitV2Metadata {
    /**
     * Name for this permit, for organization and UI usage, not included in signature.
     */
    name: string;
    /**
     * The type of the PermitV2 (self / sharing)
     * (self) Permit that will be signed and used by the issuer
     * (sharing) Permit that is signed by the issuer, but intended to be shared with recipient
     * (recipient) Permit that has been received, and signed by the recipient
     */
    type: "self" | "sharing" | "recipient";
    /**
     * (base) User that initially created the permission, target of data fetching
     */
    issuer: string;
    /**
     * (base) Expiration timestamp
     */
    expiration: number;
    /**
     * (base) List of contract addresses that can be accessed with this permission
     */
    contracts: string[];
    /**
     * (base) List of project identifiers (strings) that can be accessed
     */
    projects: string[];
    /**
     * (sharing) The user that this permission will be shared with
     * ** optional, use `address(0)` to disable **
     */
    recipient: string;
    /**
     * (issuer defined validation) An id used to query a contract to check this permissions validity
     * ** optional, use `0` to disable **
     */
    validatorId: number;
    /**
     * (issuer defined validation) The contract to query to determine permission validity
     * ** optional, user `address(0)` to disable **
     */
    validatorContract: string;
    /**
     * (base) The publicKey of a sealingPair used to re-encrypt `issuer`s confidential data
     *   (non-sharing) Populated by `issuer`
     *   (sharing)     Populated by `recipient`
     */
    sealingPair: SealingKey;
    /**
     * (base) `signTypedData` signature created by `issuer`.
     * (base) Shared- and Self- permissions differ in signature format: (`sealingKey` absent in shared signature)
     *   (non-sharing) < issuer, expiration, contracts, projects, recipient, validatorId, validatorContract, sealingKey >
     *   (sharing)     < issuer, expiration, contracts, projects, recipient, validatorId, validatorContract >
     */
    issuerSignature: string;
    /**
     * (sharing) `signTypedData` signature created by `recipient` with format:
     * (sharing) < sealingKey, issuerSignature>
     * ** required for shared permits **
     */
    recipientSignature: string;
    /**
     * Chain that this permit was signed on. In part used for mock encrypt/unseal on hardhat network.
     * Should not be set manually, included in metadata as part of serialization flows.
     */
    _signedChainId: string | undefined;
    constructor(options: PermitV2Interface, metadata?: Partial<PermitV2Metadata>);
    static create(options: PermitV2Options): Promise<PermitV2>;
    static createAndSign(options: PermitV2Options, chainId: string | undefined, signer: AbstractSigner | undefined): Promise<PermitV2>;
    updateName: (name: string) => void;
    /**
     * Creates a `PermitV2` from a serialized permit, hydrating methods and classes
     * NOTE: Does not return a stringified permit
     *
     * @param {SerializedPermitV2} - Permit structure excluding classes
     * @returns {PermitV2} - New instance of PermitV2 class
     */
    static deserialize: ({ _signedChainId, sealingPair, ...permit }: SerializedPermitV2) => PermitV2;
    static validate: (permit: PermitV2) => import("zod").SafeParseReturnType<{
        type: "self" | "sharing" | "recipient";
        issuer: string;
        sealingPair: {
            publicKey: string;
            privateKey: string;
        };
        recipient?: string | undefined;
        contracts?: string[] | undefined;
        projects?: string[] | undefined;
        name?: string | undefined;
        expiration?: number | undefined;
        validatorId?: number | undefined;
        validatorContract?: string | undefined;
        issuerSignature?: string | undefined;
        recipientSignature?: string | undefined;
    }, {
        recipient: string;
        contracts: string[];
        projects: string[];
        name: string;
        type: "self" | "sharing" | "recipient";
        issuer: string;
        expiration: number;
        validatorId: number;
        validatorContract: string;
        sealingPair: {
            publicKey: string;
            privateKey: string;
        };
        issuerSignature: string;
        recipientSignature: string;
    }>;
    /**
     * Utility to extract the public data from a permit.
     * Used in `serialize`, `getPermission`, `getHash` etc
     */
    getInterface: () => PermitV2Interface;
    /**
     * Export the necessary permit data to share a permit with another user
     */
    export: () => string;
    /**
     * Returns a serializable permit instance, removing classes and methods.
     * NOTE: Does not return a stringified permit
     */
    serialize: () => SerializedPermitV2;
    /**
     * Extracts a contract input ready permission from this permit.
     * The permission inherits most fields from the permit, however
     * `permit.sealingPair` is removed and replaced by `permit.sealingPair.publicKey` in the `sealingKey` field.
     *
     * @permit {boolean} skipValidation - Flag to prevent running validation on the permit before returning the extracted permission. Used internally.
     * @returns {PermissionV2}
     */
    getPermission: (skipValidation?: boolean) => PermissionV2;
    /**
     * Returns a stable hash depending on the core data of the permit.
     * Is used in the store as each permit's key in the permit map.
     */
    getHash: () => string;
    /**
     * Returns the domain, types, primaryType, and message fields required to request the user's signature
     * Primary type is returned to allow viem clients to more easily connect
     */
    getSignatureParams: (chainId: string, primaryType: PermitV2SignaturePrimaryType) => {
        types: import("../../types/EIP712").EIP712Types;
        primaryType: string;
        message: import("../../types/EIP712").EIP712Message;
        domain: {
            name: string;
            version: string;
            chainId: number; /**
             * (base) The publicKey of a sealingPair used to re-encrypt `issuer`s confidential data
             *   (non-sharing) Populated by `issuer`
             *   (sharing)     Populated by `recipient`
             */
            verifyingContract: string;
        };
    };
    /**
     * Determines the required signature type.
     * Creates the EIP712 types and message.
     * Prompts the user for their signature.
     * Inserts the signature into `issuerSignature` or `recipientSignature` as necessary.
     *
     * @param {string} chainId - Used as part of the EIP712 domain, throws if undefined
     * @param {AbstractSigner} signer - Signer responsible for signing the EIP712 permit signature, throws if undefined
     */
    sign: (chainId: string | undefined, signer: AbstractSigner | undefined) => Promise<void>;
    /**
     * Use the privateKey of `permit.sealingPair` to unseal `ciphertext` returned from the Fhenix chain.
     * Useful when not using `SealedItem` structs and need to unseal an individual ciphertext.
     */
    unsealCiphertext: (ciphertext: string) => bigint;
    /**
     * Uses the privateKey of `permit.sealingPair` to recursively unseal any contained `SealedItems`.
     * If `item` is a single `SealedItem` it will be individually.
     * NOTE: Only unseals typed `SealedItem`s returned from `FHE.sealoutputTyped` and the FHE bindings' `e____.sealTyped`.
     *
     * @param {any | any[]} item - Array, object, or item. Any nested `SealedItems` will be unsealed.
     * @returns - Recursively unsealed data in the target type, SealedBool -> boolean, SealedAddress -> string, etc.
     */
    unseal<T>(item: T): MappedUnsealedTypes<T>;
    unseal<T extends any[]>(item: [...T]): [...MappedUnsealedTypes<T>];
    /**
     * Check if permit satisfies the requirements param.
     * Permit must satisfy either the contracts list or the projects list
     *
     * @param {{contracts?: string[], projects?: string[]}} requirements - Lists of contract and project requirements.
     * @returns {satisfies: boolean, unsatisfiedContracts, unsatisfiedProjects} - satisfied if either req list is fulfilled.
     */
    getSatisfies: (requirements: {
        contracts?: string[];
        projects?: string[];
    }) => {
        satisfies: true;
        unsatisfiedContracts: null;
        unsatisfiedProjects: null;
    } | {
        satisfies: false;
        unsatisfiedContracts: string[];
        unsatisfiedProjects: string[];
    };
    /**
     * Returns whether the active party has created their signature.
     * If `permit.type` is self or sharing, the active party is `issuer`.
     * If `permit.type` is recipient, the active party is `recipient`
     *
     * @returns {boolean}
     */
    isSigned: () => boolean;
    /**
     * Returns whether this permit has expired due to `permit.expiration`
     *
     * @returns {boolean}
     */
    isExpired: () => boolean;
    /**
     * Overall validity checker of a permit, checks the signatures and expirations
     *
     * @returns {{valid: boolean, error: string}} - If `valid`, `error` is null, else `error` indicates which validity check failed
     */
    isValid: () => {
        readonly valid: false;
        readonly error: "expired";
    } | {
        readonly valid: false;
        readonly error: "not-signed";
    } | {
        readonly valid: true;
        readonly error: null;
    };
}
//# sourceMappingURL=permit.d.ts.map