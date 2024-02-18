import { isAddress } from "../../../sdk/utils";
import {
  determineRequestMethod,
  determineRequestSigner,
  SupportedProvider,
} from "../../../sdk/types";
import { EIP712, EIP712Domain, EIP712Message, EIP712Types } from "../EIP712";
import { GenerateSealingKey, SealingKey } from "../../../sdk/sealing";

const PERMIT_PREFIX = "Fhenix_saved_permit_";

export type Permission = {
  signature: string;
  publicKey: string;
};

/**
 * Represents a permit with cryptographic properties.
 */
export type Permit = {
  /**
   * The Ethereum contract address associated with the permit.
   */
  contractAddress: string;

  /**
   * The sealing key information required to seal or unseal data related to the permit.
   */
  sealingKey: SealingKey;

  /**
   * A cryptographic signature proving the authenticity and integrity of the permit.
   */
  signature: string;

  /**
   * The public key corresponding to the private key used to generate the signature.
   */
  publicKey: string;
};

type SerializedPermit = {
  contractAddress: string;
  sealingKey: {
    privateKey: string;
    publicKey: string;
  };
  signature: string;
};

const parsePermit = (savedPermit: string): Permit => {
  const o = JSON.parse(savedPermit) as SerializedPermit;
  if (o) {
    return {
      contractAddress: o.contractAddress,
      sealingKey: new SealingKey(
        o.sealingKey.privateKey,
        o.sealingKey.publicKey,
      ),
      signature: o.signature,
      publicKey: `0x${o.sealingKey.publicKey}`,
    };
  }
  throw new Error(`Cannot parse permit`);
};

export const getPermit = async (
  contract: string,
  provider: SupportedProvider,
): Promise<Permit> => {
  isAddress(contract);
  if (!provider) {
    throw new Error(`Missing provider`);
  }

  let savedPermit = null;
  if (typeof window !== "undefined" && window.localStorage) {
    savedPermit = window.localStorage.getItem(`${PERMIT_PREFIX}${contract}`);
  }

  if (savedPermit) {
    try {
      return parsePermit(savedPermit);
    } catch (err) {
      console.warn(err);
    }
  }
  return generatePermit(contract, provider);
};

export const getAllPermits = (): Map<string, Permit> => {
  const permits: Map<string, Permit> = new Map();

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.includes(PERMIT_PREFIX)) {
      const contract = key.replace(PERMIT_PREFIX, "");
      try {
        const permit = parsePermit(window.localStorage.getItem(key)!);
        permits.set(contract, permit);
      } catch (err) {
        console.warn(err);
      }
    }
  }
  return permits;
};

interface SignerPublicSignedTypedData {
  signTypedData(domain: object, types: object, value: object): Promise<string>;
}
interface SignerPrivateSignedTypedData {
  _signTypedData(domain: object, types: object, value: object): Promise<string>;
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

export const generatePermit = async (
  contract: string,
  provider: SupportedProvider,
  customSigner?: PermitSigner,
): Promise<Permit> => {
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
  const msgParams: EIP712 = {
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

  const msgSig = await sign(
    signer,
    msgParams.domain,
    { Permissioned: msgParams.types.Permissioned },
    msgParams.message,
  );

  const permit: Permit = {
    contractAddress: contract,
    sealingKey: keypair,
    signature: msgSig,
    publicKey: `0x${keypair.publicKey}`,
    //permit: msgParams,
    //msgSig
  };
  if (typeof window !== "undefined" && window.localStorage) {
    // Sealing key is a class, and will include methods in the JSON
    const serialized: SerializedPermit = {
      contractAddress: permit.contractAddress,
      sealingKey: {
        publicKey: permit.sealingKey.publicKey,
        privateKey: permit.sealingKey.privateKey,
      },
      signature: permit.signature,
    };

    window.localStorage.setItem(
      `${PERMIT_PREFIX}${contract}`,
      JSON.stringify(serialized),
    );
  }
  return permit;
};

export const removePermit = (contract: string): void => {
  window.localStorage.removeItem(`${PERMIT_PREFIX}${contract}`);
};

export const getPermitFromLocalstorage = (
  contract: string,
): Permit | undefined => {
  let savedPermit = undefined;
  if (typeof window !== "undefined" && window.localStorage) {
    savedPermit = window.localStorage.getItem(`${PERMIT_PREFIX}${contract}`);
  }

  if (!savedPermit) {
    return undefined;
  }

  return parsePermit(savedPermit);
};
