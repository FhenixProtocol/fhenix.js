import { Eip1193Provider, BrowserProvider, isAddress as ethersIsAddress } from "ethers";
import { Permit } from '../extensions/access_control';

export type ContractPermits = Record<string, Permit>;

export enum EncryptionTypes {
  uint8 = 'uint8',
  uint16 = 'uint16',
  uint32 = 'uint32',
}

export type PermitSignature = {
  publicKey: Uint8Array;
  signature: string;
};

export type InstanceParams = {
  provider?: SupportedProvider;
  initSdk?: boolean;
};


export type ContractKeypair = {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  signature?: string | null;
};


export interface EthersProvider {
  send(method: string, params?: Array<any> | Record<string, any>): Promise<any>;
  getSigner(): Promise<any>;
}

export interface HardhatEthersProvider {
  send(method: string, params?: Array<any> | undefined): Promise<any>;
  getSigner(): Promise<any>;
}

export type SupportedProvider = BrowserProvider | Eip1193Provider | EthersProvider | HardhatEthersProvider;

//// unify provider interface: eip-1193-compatible providers such as metamask's expose "request",
  // while ethers' and hardhat's may expose a slightly different "send", to issue RPC calls.
export function determineRequestMethod(provider: SupportedProvider): Function {
  if ('request' in provider && typeof provider.request == 'function') {
    return (p: SupportedProvider, method: string, params?: any[]) => (p as Eip1193Provider).request({ method, params });
  } else if ('send' in provider && typeof provider.send == 'function') {
    return (p: SupportedProvider, method: string, params?: any[]) => (p as EthersProvider).send(method, params);
  } else {
    throw new Error("Received unsupported provider. 'send' or 'request' method not found");
  }
}

export function determineRequestSigner(provider: SupportedProvider): Function {
  if ('getSigner' in provider && typeof provider.getSigner == 'function') {
    return (p: SupportedProvider) => (p as EthersProvider).getSigner();
  } else {
    throw new Error("The supplied provider cannot get a signer");
  }
}

