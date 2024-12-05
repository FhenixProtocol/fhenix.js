/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAddress, id, keccak256, ZeroAddress } from "ethers";
import {
  AbstractSigner,
  isSealedAddress,
  isSealedBool,
  isSealedItem,
  isSealedUint,
  MappedUnsealedTypes,
  PermissionV2,
  PermitV2Interface,
  PermitV2Options,
  SerializedPermitV2,
} from "../types";
import {
  getSignatureDomain,
  getSignatureTypesAndMessage,
  PermitV2SignaturePrimaryType,
  SignatureTypes,
} from "./generate";
import {
  FullyFormedPermitV2Validator,
  PermitV2ParamsValidator,
} from "./permitV2.z";
import { GenerateSealingKey, SealingKey } from "fhenixjs";

export class PermitV2 implements PermitV2Interface {
  /**
   * Name for this permit, only for organization and UX
   */
  public name: string;
  /**
   * The type of the PermitV2 (self / sharing)
   * (self) Permit that will be signed and used by the issuer
   * (sharing) Permit that is signed by the issuer, but intended to be shared with recipient
   * (recipient) Permit that has been received, and signed by the recipient
   */
  public type: "self" | "sharing" | "recipient";
  /**
   * (base) User that initially created the permission, target of data fetching
   */
  public issuer: string;
  /**
   * (base) Expiration timestamp
   */
  public expiration: number;
  /**
   * (base) List of contract addresses that can be accessed with this permission
   */
  public contracts: string[];
  /**
   * (base) List of project identifiers (strings) that can be accessed
   */
  public projects: string[];
  /**
   * (sharing) The user that this permission will be shared with
   * ** optional, use `address(0)` to disable **
   */
  public recipient: string;
  /**
   * (issuer defined validation) An id used to query a contract to check this permissions validity
   * ** optional, use `0` to disable **
   */
  public validatorId: number;
  /**
   * (issuer defined validation) The contract to query to determine permission validity
   * ** optional, user `address(0)` to disable **
   */
  public validatorContract: string;
  /**
   * (base) The publicKey of a sealingPair used to re-encrypt `issuer`s confidential data
   *   (non-sharing) Populated by `issuer`
   *   (sharing)     Populated by `recipient`
   */
  public sealingPair: SealingKey;
  /**
   * (base) `signTypedData` signature created by `issuer`.
   * (base) Shared- and Self- permissions differ in signature format: (`sealingKey` absent in shared signature)
   *   (non-sharing) < issuer, expiration, contracts, projects, recipient, validatorId, validatorContract, sealingKey >
   *   (sharing)     < issuer, expiration, contracts, projects, recipient, validatorId, validatorContract >
   */
  public issuerSignature: string;
  /**
   * (sharing) `signTypedData` signature created by `recipient` with format:
   * (sharing) < sealingKey, issuerSignature>
   * ** required for shared permits **
   */
  public recipientSignature: string;

  public constructor(options: PermitV2Interface) {
    this.name = options.name;
    this.type = options.type;
    this.issuer = options.issuer;
    this.expiration = options.expiration;
    this.contracts = options.contracts;
    this.projects = options.projects;
    this.recipient = options.recipient;
    this.validatorId = options.validatorId;
    this.validatorContract = options.validatorContract;
    this.sealingPair = options.sealingPair;
    this.issuerSignature = options.issuerSignature;
    this.recipientSignature = options.recipientSignature;
  }

  static async create(options: PermitV2Options) {
    const {
      success,
      data: parsed,
      error,
    } = PermitV2ParamsValidator.safeParse(options);

    if (!success) {
      throw new Error(
        "PermitV2 :: create :: Parsing PermitV2Options failed " +
          JSON.stringify(error, null, 2),
      );
    }

    const sealingPair =
      parsed.sealingPair != null
        ? new SealingKey(
            parsed.sealingPair.privateKey,
            parsed.sealingPair.publicKey,
          )
        : await GenerateSealingKey();

    return new PermitV2({
      ...parsed,
      sealingPair,
    });
  }

  static async createAndSign(
    options: PermitV2Options,
    chainId: string | undefined,
    signer: AbstractSigner | undefined,
  ) {
    const permit = await PermitV2.create(options);
    await permit.sign(chainId, signer);
    return permit;
  }

  updateName = (name: string) => {
    this.name = name;
  };

  /**
   * Creates a `PermitV2` from a serialized permit, hydrating methods and classes
   * NOTE: Does not return a stringified permit
   *
   * @param {SerializedPermitV2} - Permit structure excluding classes
   * @returns {PermitV2} - New instance of PermitV2 class
   */
  static deserialize = ({ sealingPair, ...permit }: SerializedPermitV2) => {
    return new PermitV2({
      ...permit,
      sealingPair: new SealingKey(
        sealingPair.privateKey,
        sealingPair.publicKey,
      ),
    });
  };

  static validate = (permit: PermitV2) => {
    return FullyFormedPermitV2Validator.safeParse(permit);
  };

  /**
   * Utility to extract the public data from a permit.
   * Used in `serialize`, `getPermission`, `getHash` etc
   */
  getInterface = (): PermitV2Interface => {
    return {
      name: this.name,
      type: this.type,
      issuer: this.issuer,
      expiration: this.expiration,
      contracts: this.contracts,
      projects: this.projects,
      recipient: this.recipient,
      validatorId: this.validatorId,
      validatorContract: this.validatorContract,
      sealingPair: this.sealingPair,
      issuerSignature: this.issuerSignature,
      recipientSignature: this.recipientSignature,
    };
  };

  /**
   * Export the necessary permit data to share a permit with another user
   */
  export = () => {
    const cleanedPermit: Record<string, unknown> = {
      name: this.name,
      type: this.type,
      issuer: this.issuer,
      expiration: this.expiration,
    };

    if (this.contracts.length > 0) cleanedPermit.contracts = this.contracts;
    if (this.projects.length > 0) cleanedPermit.projects = this.projects;
    if (this.recipient !== ZeroAddress)
      cleanedPermit.recipient = this.recipient;
    if (this.validatorId !== 0) cleanedPermit.validatorId = this.validatorId;
    if (this.validatorContract !== ZeroAddress)
      cleanedPermit.validatorContract = this.validatorContract;
    if (this.type === "sharing" && this.issuerSignature !== "0x")
      cleanedPermit.issuerSignature = this.issuerSignature;

    return JSON.stringify(cleanedPermit, undefined, 2);
  };

  /**
   * Returns a serializable permit instance, removing classes and methods.
   * NOTE: Does not return a stringified permit
   */
  serialize = (): SerializedPermitV2 => {
    const { sealingPair, ...permit } = this.getInterface();
    return {
      ...permit,
      sealingPair: {
        publicKey: sealingPair.publicKey,
        privateKey: sealingPair.privateKey,
      },
    };
  };

  /**
   * Extracts a contract input ready permission from this permit.
   * The permission inherits most fields from the permit, however
   * `permit.sealingPair` is removed and replaced by `permit.sealingPair.publicKey` in the `sealingKey` field.
   *
   * @permit {boolean} skipValidation - Flag to prevent running validation on the permit before returning the extracted permission. Used internally.
   * @returns {PermissionV2}
   */
  getPermission = (skipValidation = false): PermissionV2 => {
    const permitData = this.getInterface();

    if (!skipValidation) {
      const validationResult =
        FullyFormedPermitV2Validator.safeParse(permitData);

      if (!validationResult.success) {
        throw new Error(
          `PermitV2 :: getPermission :: permit validation failed - ${JSON.stringify(
            validationResult.error,
            null,
            2,
          )} ${JSON.stringify(permitData, null, 2)}`,
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, type, sealingPair, ...permit } = permitData;
    return {
      ...permit,
      sealingKey: `0x${sealingPair.publicKey}`,
    };
  };

  /**
   * Returns a stable hash depending on the core data of the permit.
   * Is used in the store as each permit's key in the permit map.
   */
  getHash = () =>
    keccak256(
      id(
        JSON.stringify({
          type: this.type,
          issuer: this.issuer,
          expiration: this.expiration,
          contracts: this.contracts,
          projects: this.projects,
          recipient: this.recipient,
          validatorId: this.validatorId,
          validatorContract: this.validatorContract,
        }),
      ),
    );

  /**
   * Returns the domain, types, primaryType, and message fields required to request the user's signature
   * Primary type is returned to allow viem clients to more easily connect
   */
  getSignatureParams = (
    chainId: string,
    primaryType: PermitV2SignaturePrimaryType,
  ) => {
    return {
      domain: getSignatureDomain(chainId),
      ...getSignatureTypesAndMessage(
        primaryType,
        SignatureTypes[primaryType],
        this.getPermission(true),
      ),
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
  sign = async (
    chainId: string | undefined,
    signer: AbstractSigner | undefined,
  ) => {
    if (chainId == null)
      throw new Error(
        "PermitV2 :: sign - chainId undefined, cannot sign a permit with an unknown chainId",
      );
    if (signer == null)
      throw new Error(
        "PermitV2 :: sign - signer undefined, you must pass in a `signer` for the connected user to create a permitV2 signature",
      );

    let primaryType: PermitV2SignaturePrimaryType = "PermissionedV2IssuerSelf";
    if (this.type === "self") primaryType = "PermissionedV2IssuerSelf";
    if (this.type === "sharing") primaryType = "PermissionedV2IssuerShared";
    if (this.type === "recipient") primaryType = "PermissionedV2Recipient";

    const { domain, types, message } = this.getSignatureParams(
      chainId,
      primaryType,
    );
    const signature = await signer.signTypedData(
      domain,
      types,
      primaryType,
      message,
    );

    if (this.type === "self" || this.type === "sharing") {
      this.issuerSignature = signature;
    }
    if (this.type === "recipient") {
      this.recipientSignature = signature;
    }
  };

  /**
   * Use the privateKey of `permit.sealingPair` to unseal `ciphertext` returned from the Fhenix chain
   */
  unsealCiphertext = (ciphertext: string): bigint => {
    return this.sealingPair.unseal(ciphertext);
  };

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
  unseal<T>(item: T) {
    // SealedItem
    if (isSealedItem(item)) {
      const bn = this.sealingPair.unseal(item.data);
      if (isSealedBool(item)) {
        // Return a boolean for SealedBool
        return Boolean(bn).valueOf() as any;
      }
      if (isSealedAddress(item)) {
        // Return a string for SealedAddress
        return getAddress(`0x${bn.toString(16).slice(-40)}`) as any;
      }
      if (isSealedUint(item)) {
        // Return a bigint for SealedUint
        return bn as any;
      }
    }

    // Object | Array
    if (typeof item === "object" && item !== null) {
      if (Array.isArray(item)) {
        // Array - recurse
        return item.map((nestedItem) => this.unseal(nestedItem));
      } else {
        // Object - recurse
        const result: any = {};
        for (const key in item) {
          result[key] = this.unseal(item[key]);
        }
        return result;
      }
    }

    // Primitive
    return item;
  }

  /**
   * Check if permit satisfies the requirements param.
   * Permit must satisfy either the contracts list or the projects list
   *
   * @param {{contracts?: string[], projects?: string[]}} requirements - Lists of contract and project requirements.
   * @returns {satisfies: boolean, unsatisfiedContracts, unsatisfiedProjects} - satisfied if either req list is fulfilled.
   */
  getSatisfies = (requirements: {
    contracts?: string[];
    projects?: string[];
  }):
    | { satisfies: true; unsatisfiedContracts: null; unsatisfiedProjects: null }
    | {
        satisfies: false;
        unsatisfiedContracts: string[];
        unsatisfiedProjects: string[];
      } => {
    let contractsSatisfied = true;
    const unsatisfiedContracts: string[] = [];
    for (const contract in requirements.contracts) {
      if (!this.contracts.includes(contract)) {
        contractsSatisfied = false;
        unsatisfiedContracts.push(contract);
      }
    }

    let projectsSatisfied = true;
    const unsatisfiedProjects: string[] = [];
    for (const project in requirements.projects) {
      if (!this.projects.includes(project)) {
        projectsSatisfied = false;
        unsatisfiedProjects.push(project);
      }
    }

    if (contractsSatisfied || projectsSatisfied)
      return {
        satisfies: true,
        unsatisfiedContracts: null,
        unsatisfiedProjects: null,
      };

    return {
      satisfies: false,
      unsatisfiedContracts,
      unsatisfiedProjects,
    };
  };

  /**
   * Returns whether the active party has created their signature.
   * If `permit.type` is self or sharing, the active party is `issuer`.
   * If `permit.type` is recipient, the active party is `recipient`
   *
   * @returns {boolean}
   */
  isSigned = () => {
    if (this.type === "self" || this.type === "sharing") {
      return this.issuerSignature !== "0x";
    }
    if (this.type === "recipient") {
      return this.recipientSignature != "0x";
    }
    return false;
  };

  /**
   * Returns whether this permit has expired due to `permit.expiration`
   *
   * @returns {boolean}
   */
  isExpired = () => {
    return this.expiration < Math.floor(Date.now() / 1000);
  };

  /**
   * Overall validity checker of a permit, checks the signatures and expirations
   *
   * @returns {{valid: boolean, error: string}} - If `valid`, `error` is null, else `error` indicates which validity check failed
   */
  isValid = () => {
    if (this.isExpired()) return { valid: false, error: "expired" } as const;
    if (!this.isSigned()) return { valid: false, error: "not-signed" } as const;
    return { valid: true, error: null } as const;
  };
}
