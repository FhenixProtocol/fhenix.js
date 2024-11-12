import { ZeroAddress } from "../../../sdk/utils.js";
import { EIP712Message, EIP712Types } from "../EIP712.js";
import { GenerateSealingKey, SealingKey } from "../../../sdk/sealing.js";
import { keccak256 } from "ethers";

const PERMIT_V2_PREFIX = "Fhenix_saved_permit_v2";
const ACTIVE_PERMIT_V2_HASH_PREFIX = "Fhenix_active_permit_v2_hash";

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

/**
 * A type representing the PermissionV2 struct that is passed to PermissionedV2.sol to grant encrypted data access.
 */
export type PermissionV2 = Expand<
  Omit<PermitV2, "sealingPair"> & {
    sealingKey: string;
  }
>;
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

const PermitV2SignatureAllFields = [
  { name: "issuer", type: "address" },
  { name: "expiration", type: "uint64" },
  { name: "contracts", type: "address[]" },
  { name: "projects", type: "string[]" },
  { name: "recipient", type: "address" },
  { name: "validatorId", type: "uint256" },
  { name: "validatorContract", type: "address" },
  { name: "sealingKey", type: "bytes32" },
  { name: "issuerSignature", type: "bytes" },
] as const;
type PermitV2SignatureFieldOption =
  (typeof PermitV2SignatureAllFields)[number]["name"];

const SignatureTypes = {
  PermissionedV2IssuerSelf: [
    "issuer",
    "expiration",
    "contracts",
    "projects",
    "recipient",
    "validatorId",
    "validatorContract",
    "sealingKey",
  ] satisfies PermitV2SignatureFieldOption[],
  PermissionedV2IssuerShared: [
    "issuer",
    "expiration",
    "contracts",
    "projects",
    "recipient",
    "validatorId",
    "validatorContract",
  ] satisfies PermitV2SignatureFieldOption[],
  PermissionedV2Receiver: [
    "sealingKey",
    "issuerSignature",
  ] satisfies PermitV2SignatureFieldOption[],
} as const;
type SignatureIdentifier = keyof typeof SignatureTypes;

const getSignatureTypesAndMessage = <T extends PermitV2SignatureFieldOption>(
  typeName: SignatureIdentifier,
  fields: T[] | readonly T[],
  values: Expand<Pick<PermissionV2, T> & Partial<PermissionV2>>,
): { types: EIP712Types; message: EIP712Message } => {
  const types = {
    [typeName]: PermitV2SignatureAllFields.filter((fieldType) =>
      fields.includes(fieldType.name as T),
    ),
  };

  const message: EIP712Message = {};
  for (const field in fields) {
    message[field] = values[field];
  }

  return { types, message };
};

type SerializedPermitV2 = Omit<PermitV2, "sealingPair"> & {
  sealingPair: {
    privateKey: string;
    publicKey: string;
  };
};

export const getPermitV2Hash = (permitV2: PermitV2Core): string => {
  return keccak256(
    JSON.stringify({
      issuer: permitV2.issuer,
      contracts: permitV2.contracts ?? [],
      projects: permitV2.projects ?? [],
      recipient: permitV2.recipient ?? ZeroAddress,
      validatorId: permitV2.validatorId ?? 0,
      validatorContract: permitV2.validatorContract ?? ZeroAddress,
    }),
  );
};

const serializePermitV2 = (permitV2: PermitV2): string =>
  JSON.stringify({
    ...permitV2,
    sealingPair: {
      publicKey: permitV2.sealingPair.publicKey,
      privateKey: permitV2.sealingPair.privateKey,
    },
  } as SerializedPermitV2);

const parsePermitV2 = (savedPermit: string): PermitV2 => {
  const o = JSON.parse(savedPermit) as SerializedPermitV2;
  if (o) {
    return {
      ...o,
      sealingPair: new SealingKey(
        o.sealingPair.privateKey,
        o.sealingPair.publicKey,
      ),
    };
  }
  throw new Error(`Cannot parse permit`);
};

export const getPermitV2 = async (
  account: string,
  chainId: string,
  options: PermitV2Options,
  signTypedData: (
    domain: object,
    types: object,
    value: object,
  ) => Promise<string>,
  autoGenerate: boolean = true,
): Promise<PermitV2 | null> => {
  const {
    issuer,
    contracts = [],
    projects = [],
    recipient = ZeroAddress,
    validatorId = 0,
    validatorContract = ZeroAddress,
  } = options;

  const hash = getPermitV2Hash({
    issuer,
    contracts,
    projects,
    recipient,
    validatorId,
    validatorContract,
  });

  const savedPermit = getPermitV2FromLocalstorage(account, hash);

  const timestamp = Math.floor(Date.now() / 1000);
  if (savedPermit != null && savedPermit.expiration > timestamp)
    return savedPermit;

  return autoGenerate
    ? generatePermitV2(account, chainId, options, signTypedData)
    : null;
};

export const getAllExistingPermitV2s = (
  account: string,
): Record<string, PermitV2> => {
  const permits: Record<string, PermitV2> = {};

  const search = new RegExp(`${PERMIT_V2_PREFIX}_${account}_(.*?)`);

  Object.keys(window.localStorage).forEach((key) => {
    const matchArray = key.match(search);
    if (matchArray == null) return;

    const hash = matchArray[1];
    const permitRaw = window.localStorage.getItem(key);

    if (permitRaw == null) return;

    try {
      const permit = parsePermitV2(permitRaw);
      permits[hash] = permit;
    } catch (err) {
      console.warn(err);
    }
  });

  return permits;
};

export const generatePermitV2 = async (
  account: string,
  chainId: string,
  options: PermitV2Options,
  signTypedData: SignTypedDataFn,
): Promise<PermitV2> => {
  const {
    issuer,
    contracts = [],
    projects = [],
    expiration = 1000000000000,
    recipient = ZeroAddress,
    validatorId = 0,
    validatorContract = ZeroAddress,
  } = options;

  const isSharing = recipient !== ZeroAddress;

  const keypair = await GenerateSealingKey();

  const signatureName = isSharing
    ? "PermissionedV2IssuerShared"
    : "PermissionedV2IssuerSelf";

  const { types, message } = getSignatureTypesAndMessage(
    signatureName,
    SignatureTypes[signatureName],
    {
      issuer,
      sealingKey: `0x${keypair.publicKey}`,
      expiration,
      contracts,
      projects,
      recipient,
      validatorId,
      validatorContract,
    },
  );

  const issuerSignature = await signTypedData(
    {
      name: "Fhenix Permission v2.0.0",
      version: "v2.0.0",
      chainId,
      verifyingContract: ZeroAddress,
    },
    types,
    message,
  );

  const permitV2: PermitV2 = {
    issuer,
    expiration,
    sealingPair: keypair,
    contracts,
    projects,
    recipient: recipient,
    validatorId,
    validatorContract,
    issuerSignature,
    recipientSignature: "0x",
  };

  storePermitV2InLocalStorage(account, permitV2);
  updateActivePermitV2HashInLS(account, permitV2);
  return permitV2;
};

const localStorageAvailable = () =>
  typeof window !== "undefined" && window.localStorage != null;

export const getPermitV2FromLocalstorage = (
  account: string,
  hash: string,
): PermitV2 | undefined => {
  if (!localStorageAvailable()) return;

  const savedPermit = window.localStorage.getItem(
    [PERMIT_V2_PREFIX, account, hash].join("_"),
  );
  if (savedPermit == null) return;

  return parsePermitV2(savedPermit);
};

export const storePermitV2InLocalStorage = (
  account: string,
  permitV2: PermitV2,
) => {
  if (!localStorageAvailable()) return;

  const hash = getPermitV2Hash(permitV2);

  window.localStorage.setItem(
    [PERMIT_V2_PREFIX, account, hash].join("_"),
    serializePermitV2(permitV2),
  );
};

export const removePermitV2FromLocalStorage = (
  account: string,
  hash: string,
): void => {
  if (!localStorageAvailable()) return;
  window.localStorage.removeItem([PERMIT_V2_PREFIX, account, hash].join("_"));
};

// Localstorage (active permitV2 hash)

export const updateActivePermitV2HashInLS = (
  account: string,
  permitV2: PermitV2,
) => {
  if (!localStorageAvailable()) return;

  window.localStorage.setItem(
    [ACTIVE_PERMIT_V2_HASH_PREFIX, account].join("_"),
    getPermitV2Hash(permitV2),
  );
};

export const getActivePermitV2HashFromLS = (account: string) => {
  if (!localStorageAvailable()) return;

  const hash = window.localStorage.getItem(
    [ACTIVE_PERMIT_V2_HASH_PREFIX, account].join("_"),
  );

  if (hash == null) return;
  return hash;
};
