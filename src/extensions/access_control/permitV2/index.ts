import { ZeroAddress } from "../../../sdk/utils.js";
import {
  determineRequestMethod,
  determineRequestSigner,
  SupportedProvider,
} from "../../../sdk/types.js";
import { EIP712Domain, EIP712Message, EIP712Types } from "../EIP712.js";
import { GenerateSealingKey, SealingKey } from "../../../sdk/sealing.js";
import { keccak256 } from "ethers";

const PERMIT_V2_PREFIX = "Fhenix_saved_permit_v2_";

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

/**
 * A type representing the PermissionV2 struct that is passed to PermissionedV2.sol to grant encrypted data access.
 */
export type PermissionV2 = Expand<
  Omit<PermitV2, "sealingPair"> & {
    sealingKey: string;
  }
>;
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type SerializedPermitV2 = Omit<PermitV2, "sealingPair"> & {
  sealingPair: {
    privateKey: string;
    publicKey: string;
  };
};

const getPermitV2Hash = (
  permitV2: Pick<
    PermitV2,
    | "issuer"
    | "contracts"
    | "projects"
    | "recipient"
    | "validatorId"
    | "validatorContract"
  >,
): string => {
  return keccak256(
    JSON.stringify({
      issuer: permitV2.issuer,
      contracts: permitV2.contracts,
      projects: permitV2.projects,
      recipient: permitV2.recipient,
      validatorId: permitV2.validatorId,
      validatorContract: permitV2.validatorContract,
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
  options: Partial<
    Omit<PermitV2, "sealingPair" | "issuerSignature" | "recipientSignature">
  > &
    Pick<PermitV2, "issuer">,
  provider: SupportedProvider,
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

  const savedPermit = getPermitV2FromLocalstorage(hash);

  const timestamp = Math.floor(Date.now() / 1000);
  if (savedPermit != null && savedPermit.expiration > timestamp)
    return savedPermit;

  return autoGenerate ? generatePermitV2(options, provider) : null;
};

export const getAllExistingPermitV2s = (
  account: string,
): Record<string, PermitV2> => {
  const permits: Record<string, PermitV2> = {};

  const search = new RegExp(`${PERMIT_V2_PREFIX}(.*?)_${account}`);

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

interface SignerPublicSignedTypedData {
  signTypedData(domain: object, types: object, value: object): Promise<string>;
  getAddress(): Promise<string>;
}
interface SignerPrivateSignedTypedData {
  _signTypedData(domain: object, types: object, value: object): Promise<string>;
  getAddress(): Promise<string>;
}

export type PermitSigner =
  | SignerPrivateSignedTypedData
  | SignerPublicSignedTypedData;

const sign = async (
  signer: PermitSigner,
  domain: EIP712Domain,
  types: EIP712Types,
  value: EIP712Message,
): Promise<string> => {
  if (
    "_signTypedData" in signer &&
    typeof signer._signTypedData == "function"
  ) {
    return await signer._signTypedData(domain, types, value);
  } else if (
    "signTypedData" in signer &&
    typeof signer.signTypedData == "function"
  ) {
    return await signer.signTypedData(domain, types, value);
  }
  throw new Error("Unsupported signer");
};

export const generatePermitV2 = async (
  options: Partial<
    Omit<PermitV2, "sealingPair" | "issuerSignature" | "recipientSignature">
  > &
    Pick<PermitV2, "issuer">,
  provider: SupportedProvider,
  customSigner?: PermitSigner,
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

  if (!provider) {
    throw new Error("Provider is undefined");
  }

  const requestMethod = determineRequestMethod(provider);

  let signer: PermitSigner;
  if (!customSigner) {
    const getSigner = determineRequestSigner(provider);
    signer = await getSigner(provider);
  } else {
    signer = customSigner;
  }

  const chainId = await requestMethod(provider, "eth_chainId", []);

  const keypair = await GenerateSealingKey();

  let types: EIP712Types = {
    PermissionedV2IssuerSelf: [
      { name: "issuer", type: "address" },
      { name: "expiration", type: "uint64" },
      { name: "contracts", type: "address[]" },
      { name: "projects", type: "string[]" },
      { name: "recipient", type: "address" },
      { name: "validatorId", type: "uint256" },
      { name: "validatorContract", type: "address" },
      { name: "sealingKey", type: "bytes32" },
    ],
  };
  let message: object = {
    issuer,
    sealingKey: `0x${keypair.publicKey}`,
    expiration: expiration.toString(),
    contracts,
    projects,
    recipient,
    validatorId,
    validatorContract,
  };

  if (isSharing) {
    types = {
      PermissionedV2IssuerShared: [
        { name: "issuer", type: "address" },
        { name: "expiration", type: "uint64" },
        { name: "contracts", type: "address[]" },
        { name: "projects", type: "string[]" },
        { name: "recipient", type: "address" },
        { name: "validatorId", type: "uint256" },
        { name: "validatorContract", type: "address" },
      ],
    };
    message = {
      issuer,
      expiration: expiration.toString(),
      contracts,
      projects,
      recipient,
      validatorId,
      validatorContract,
    };
  }

  const msgSig = await sign(
    signer,
    // Domain
    {
      name: "Fhenix Permission v2.0.0",
      version: "v2.0.0",
      chainId,
      verifyingContract: ZeroAddress,
    },
    types,
    message as EIP712Message,
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
    issuerSignature: msgSig,
    recipientSignature: "0x",
  };

  storePermitV2InLocalStorage(permitV2);
  return permitV2;
};

export const removePermitV2 = (hash: string): void => {
  if (typeof window === "undefined" || window.localStorage == null) return;

  window.localStorage.removeItem(`${PERMIT_V2_PREFIX}${hash}`);
};

export const getPermitV2FromLocalstorage = (
  hash: string,
): PermitV2 | undefined => {
  if (typeof window === "undefined" || window.localStorage == null) return;

  const savedPermit = window.localStorage.getItem(`${PERMIT_V2_PREFIX}${hash}`);
  if (savedPermit == null) return;

  return parsePermitV2(savedPermit);
};

export const storePermitV2InLocalStorage = (permitV2: PermitV2) => {
  if (typeof window === "undefined" || window.localStorage == null) return;

  const hash = getPermitV2Hash(permitV2);

  window.localStorage.setItem(
    `${PERMIT_V2_PREFIX}${hash}`,
    serializePermitV2(permitV2),
  );
};

export const removePermitV2FromLocalstorage = (hash: string) => {
  if (typeof window === "undefined" || window.localStorage == null) return;
  window.localStorage.removeItem(`${PERMIT_V2_PREFIX}${hash}`);
};
