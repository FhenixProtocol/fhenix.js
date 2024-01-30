import { Eip1193Provider, BrowserProvider } from "ethers";
import { Permit } from "../extensions/access_control";

export { PermitSigner } from "../extensions/access_control";

/**
 * A type representing a mapping of contract addresses to their corresponding permits.
 * Each key is a string representing the contract's address, and each value is a Permit object.
 */
export type ContractPermits = Record<string, Permit>;

/**
 * An enumeration of supported encryption types.
 * uint8, uint16, and uint32 represent the different sizes of integers that can be encrypted.
 */
export enum EncryptionTypes {
  uint8 = "uint8",
  uint16 = "uint16",
  uint32 = "uint32",
}

/**
 * A type representing the signature for a permit.
 * Contains a public key and a signature string.
 */
export type PermitSignature = {
  publicKey: Uint8Array;
  signature: string;
};

/**
 * A type representing the parameters to initialize an instance.
 * provider is an optional SupportedProvider for blockchain interactions.
 * initSdk is an optional boolean indicating whether to initialize the SDK.
 */
export type InstanceParams = {
  provider?: SupportedProvider;
  initSdk?: boolean;
  ignoreErrors?: boolean;
};

/**
 * A type representing a pair of public and private keys used for a contract, along with an optional signature.
 */
export type ContractKeypair = {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  signature?: string | null;
};

export interface EthersProvider {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  send(method: string, params?: Array<any> | Record<string, any>): Promise<any>;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  getSigner(): Promise<any>;
}

/**
 * An interface for a HardhatEthersProvider, similar to EthersProvider but for Hardhat environment.
 */
export interface HardhatEthersProvider {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  send(method: string, params?: Array<any> | undefined): Promise<any>;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  getSigner(): Promise<any>;
}

/**
 * An interface for a YetAnotherHardhatEthersProvider, similar to HardhatEthersProvider but for the latest @nomiclabs/hardhat-ethers version (v2.2.3).
 */
export interface YetAnotherHardhatEthersProvider {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  send(method: string, params: Array<any>): Promise<any>;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  getSigner(addressOrIndex?: string | number): Promise<any>;
}

/**
 * A type representing a supported provider.
 * Can be one of BrowserProvider, Eip1193Provider, EthersProvider, or HardhatEthersProvider.
 */
export type SupportedProvider =
  | BrowserProvider
  | Eip1193Provider
  | EthersProvider
  | HardhatEthersProvider
  | YetAnotherHardhatEthersProvider;

/**
 * Determines the request method for a given provider.
 * Checks if the provider has a 'request' method typical for Eip1193Providers, or a 'send' method for others.
 * Throws an error if neither method is found.
 * @param {SupportedProvider} provider - The provider to determine the request method for.
 * @returns {Function} - The determined request function.
 */
// eslint-disable-next-line  @typescript-eslint/ban-types
export function determineRequestMethod(provider: SupportedProvider): Function {
  // unify provider interface: eip-1193-compatible providers such as metamask's expose "request",
  // while ethers' and hardhat's may expose a slightly different "send", to issue RPC calls.
  // eslint-disable-next-line  @typescript-eslint/ban-types
  if ("request" in provider && typeof provider.request == "function") {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return (p: SupportedProvider, method: string, params?: any[]) =>
      (p as Eip1193Provider).request({ method, params });
  } else if ("send" in provider && typeof provider.send == "function") {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return (p: SupportedProvider, method: string, params?: any[]) =>
      (p as EthersProvider).send(method, params);
  } else {
    throw new Error(
      "Received unsupported provider. 'send' or 'request' method not found",
    );
  }
}

/**
 * Determines the request signer function for a given provider.
 * Checks if the provider has a 'getSigner' method and returns it if available.
 * Throws an error if no 'getSigner' method is found.
 * @param {SupportedProvider} provider - The provider to determine the request signer for.
 * @returns {Function} - The determined request signer function.
 */
// eslint-disable-next-line  @typescript-eslint/ban-types
export function determineRequestSigner(provider: SupportedProvider): Function {
  if ("getSigner" in provider && typeof provider.getSigner == "function") {
    return (p: SupportedProvider) => (p as EthersProvider).getSigner();
  } else {
    throw new Error("The supplied provider cannot get a signer");
  }
}

export interface EncryptedNumber {
  data: Uint8Array;
}

export interface EncryptedUint8 extends EncryptedNumber {}
export interface EncryptedUint16 extends EncryptedNumber {}
export interface EncryptedUint32 extends EncryptedNumber {}
