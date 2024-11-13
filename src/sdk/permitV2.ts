import { keccak256, ZeroAddress } from "ethers";
import {
  getSignatureTypesAndMessage,
  SignatureTypes,
} from "../extensions/access_control/permitV2/generate";
import {
  PermissionV2,
  PermitV2Interface,
  PermitV2Options,
  SerializedPermitV2,
  SignTypedDataFn,
} from "../extensions/types";
import { GenerateSealingKey, SealingKey } from "./sealing";
import { isString } from "./validation";

export class PermitV2 implements PermitV2Interface {
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
    return new PermitV2({
      contracts: [],
      projects: [],
      expiration: 1000000000000,
      recipient: ZeroAddress,
      validatorId: 0,
      validatorContract: ZeroAddress,
      sealingPair: await GenerateSealingKey(),
      issuerSignature: "0x",
      recipientSignature: "0x",
      ...options,
    });
  }

  static deserialize = ({ sealingPair, ...permit }: SerializedPermitV2) => {
    return new PermitV2({
      ...permit,
      sealingPair: new SealingKey(
        sealingPair.privateKey,
        sealingPair.publicKey,
      ),
    });
  };

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

  getInterface = (): PermitV2Interface => {
    return {
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

  getPermission = (): PermissionV2 => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, sealingPair, ...permit } = this.getInterface();
    return {
      ...permit,
      sealingKey: `0x${sealingPair.publicKey}`,
    };
  };

  getHash = () =>
    keccak256(
      JSON.stringify({
        issuer: this.issuer,
        contracts: this.contracts,
        projects: this.projects,
        recipient: this.recipient,
        validatorId: this.validatorId,
        validatorContract: this.validatorContract,
      }),
    );

  sign = async (chainId: string, signTypedData: SignTypedDataFn) => {
    if (this.type === "self") {
      const { types, message } = getSignatureTypesAndMessage(
        "PermissionedV2IssuerSelf",
        SignatureTypes.PermissionedV2IssuerSelf,
        this.getPermission(),
      );

      this.issuerSignature = await signTypedData(
        {
          name: "Fhenix Permission v2.0.0",
          version: "v2.0.0",
          chainId,
          verifyingContract: ZeroAddress,
        },
        types,
        message,
      );

      return;
    }

    if (this.type === "sharing") {
      const { types, message } = getSignatureTypesAndMessage(
        "PermissionedV2IssuerShared",
        SignatureTypes.PermissionedV2IssuerShared,
        this.getPermission(),
      );

      this.issuerSignature = await signTypedData(
        {
          name: "Fhenix Permission v2.0.0",
          version: "v2.0.0",
          chainId,
          verifyingContract: ZeroAddress,
        },
        types,
        message,
      );

      return;
    }

    if (this.type === "recipient") {
      const { types, message } = getSignatureTypesAndMessage(
        "PermissionedV2Receiver",
        SignatureTypes["PermissionedV2Receiver"],
        this.getPermission(),
      );

      this.recipientSignature = await signTypedData(
        {
          name: "Fhenix Permission v2.0.0",
          version: "v2.0.0",
          chainId,
          verifyingContract: ZeroAddress,
        },
        types,
        message,
      );
    }
  };

  unseal = (ciphertext: string): bigint => {
    isString(ciphertext);
    return this.sealingPair.unseal(ciphertext);
  };

  isSigned = () => {
    if (this.type === "self" || this.type === "sharing") {
      return this.issuerSignature !== "0x";
    }
    if (this.type === "recipient") {
      return this.recipientSignature != "0x";
    }
    return false;
  };

  isExpired = () => {
    return this.expiration < Math.floor(Date.now() / 1000);
  };

  isValid = () => {
    if (this.isExpired()) return { valid: false, error: "expired" } as const;
    if (!this.isSigned()) return { valid: false, error: "not-signed" } as const;
    return { valid: true, error: null } as const;
  };
}
