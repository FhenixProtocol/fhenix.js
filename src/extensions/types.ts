import { SealingKey } from "../sdk/sealing";

export type SendFn = (method: string, params?: unknown[]) => Promise<unknown>;
export type SignTypedDataFn = (
  domain: object,
  types: object,
  value: object,
) => Promise<string>;

/**
 * Type representing the full PermitV2
 */
export type PermitV2 = {
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
};

export type PermitV2Satisfiers = Expand<
  Pick<PermitV2, "contracts" | "projects">
>;

export type PermitV2Core = Expand<
  Pick<PermitV2, "issuer"> &
    Partial<
      Pick<
        PermitV2,
        | "contracts"
        | "projects"
        | "recipient"
        | "validatorId"
        | "validatorContract"
      >
    >
>;
export type PermitV2Options = Expand<
  Partial<
    Omit<PermitV2, "sealingPair" | "issuerSignature" | "recipientSignature">
  > &
    Pick<PermitV2, "issuer">
>;

export type SerializedPermitV2 = Omit<PermitV2, "sealingPair"> & {
  sealingPair: {
    privateKey: string;
    publicKey: string;
  };
};

/**
 * A type representing the PermissionV2 struct that is passed to PermissionedV2.sol to grant encrypted data access.
 */
export type PermissionV2 = Expand<
  Omit<PermitV2, "sealingPair"> & {
    sealingKey: string;
  }
>;

// Utils
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
