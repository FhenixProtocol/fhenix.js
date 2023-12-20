import { TfheCompactPublicKey } from 'node-tfhe';
import sodium from 'libsodium-wrappers';
import { encrypt_uint8, encrypt_uint16, encrypt_uint32, encrypt } from './encrypt';
import { unseal } from './decrypt';
import { fromHexString, isAddress, toHexString } from '../utils';
import { ContractKeypairs, SupportedProvider, EthersProvider, determineRequestMethod } from './types';
import { Eip1193Provider, Interface, AbiCoder } from "ethers";
import { FheOpsAddress } from './consts';
import { Permit } from '../extensions/access_control/permit';


export type FhevmInstance = {
  encrypt_uint8: (value: number) => Uint8Array;
  encrypt_uint16: (value: number) => Uint8Array;
  encrypt_uint32: (value: number) => Uint8Array;
  encrypt: (value: number, type?: UintTypes) => Uint8Array;

  loadPermit: (permit: Permit) => void;
  hasKeypair: (contractAddress: string) => boolean;
  unseal: (contractAddress: string, ciphertext: string) => number;
  serializeKeypairs: () => ExportedContractKeypairs;
};

export enum UintTypes {
  uint8 = 'uint8',
  uint16 = 'uint16',
  uint32 = 'uint32',
}

export type PermitSignature = {
  publicKey: Uint8Array;
  signature: string;
};

export type ExportedContractKeypairs = {
  [key: string]: {
    publicKey: string;
    privateKey: string;
    signature?: string | null;
  };
};

export type FhevmInstanceParams = {
  provider: SupportedProvider;
  keypairs?: ExportedContractKeypairs;
};

export const createInstance = async (
  params: FhevmInstanceParams,
): Promise<FhevmInstance> => {
  if (params === undefined) {
    throw new Error('createInstance: missing params');
  }
  if (typeof params !== "object") {
    throw new Error('createInstance: params is not an object');
  }
  if (params.provider === undefined) {
    throw new Error('createInstance: missing params.provider');
  }

  const { provider, keypairs } = params;

  const requestMethod = determineRequestMethod(provider);

  const chainIdP = requestMethod(provider, 'eth_chainId').catch((err: Error) => {
    throw Error(`Error while requesting chainId from provider: ${err}`);
  })

  const networkPkAbi = new Interface(["function getNetworkPublicKey()"]);
  const callData = networkPkAbi.encodeFunctionData("getNetworkPublicKey");
  const callParams = [{ to: FheOpsAddress, data: callData}, "latest"];

  const publicKeyP = requestMethod(provider, 'eth_call', callParams).catch((err: Error) => {
    throw Error(`Error while requesting network public key from provider: ${JSON.stringify(err)}`);
  });

  const [chainId, publicKey] = await Promise.all([chainIdP, publicKeyP]);

  const chainIdNum: number = parseInt(chainId, 16);
  if (isNaN(chainIdNum)) {
    throw new Error(`received non-hex number from chainId request: "${chainId}"`);
  }

  if (typeof publicKey !== 'string')
    throw new Error('Error using publicKey from provider: expected string');

  const abiCoder = AbiCoder.defaultAbiCoder();
  const publicKeyDecoded = abiCoder.decode(["bytes"], publicKey)[0];
  const buff = fromHexString(publicKeyDecoded);

  await sodium.ready;
  let tfheCompactPublicKey: TfheCompactPublicKey;
  try {
    tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
  } catch (err) {
    throw new Error(`Error deserializing public key: did you initialize fhenix.js with "initFhevm()"? ${err}`);
  }

  let contractKeypairs: ContractKeypairs = {};

  if (keypairs) {
    Object.keys(keypairs).forEach((contractAddress) => {
      if (isAddress(contractAddress)) {
        const oKeys = Object.keys(keypairs[contractAddress]);
        if (
          ['signature', 'privateKey', 'publicKey'].every((v) =>
            oKeys.includes(v),
          )
        ) {
          contractKeypairs[contractAddress] = {
            signature: keypairs[contractAddress].signature,
            publicKey: fromHexString(keypairs[contractAddress].publicKey),
            privateKey: fromHexString(keypairs[contractAddress].privateKey),
          };
        }
      }
    });
  }

  const hasKeypair = (contractAddress: string) => {
    return (
      contractKeypairs[contractAddress] != null &&
      !!contractKeypairs[contractAddress].signature
    );
  };

  const validateValue = (value: number): void => {
    if (value == null) throw new Error('Missing value');
    if (typeof value !== 'number') throw new Error('Value must be a number');
  }

  return {
    // Parameters
    encrypt_uint8(value: number) {
      validateValue(value);
      return encrypt_uint8(value, tfheCompactPublicKey);
    },
    encrypt_uint16(value: number) {
      validateValue(value);
      return encrypt_uint16(value, tfheCompactPublicKey);
    },
    encrypt_uint32(value: number) {
      validateValue(value);
      return encrypt_uint32(value, tfheCompactPublicKey);
    },
    encrypt(value: number, type: UintTypes = UintTypes.uint8) {
      validateValue(value);
      return encrypt(value, tfheCompactPublicKey, type);
    },

    loadPermit(permit: Permit) {
      contractKeypairs[permit.contractAddress] = {
        publicKey: permit.keypair.publicKey,
        privateKey: permit.keypair.privateKey,
        signature: permit.keypair.signature        
      }
    },

    hasKeypair,

    unseal(contractAddress, ciphertext) {
      if (!ciphertext) throw new Error('Missing ciphertext');
      if (!contractAddress) throw new Error('Missing contract address');
      const kp = contractKeypairs[contractAddress];
      if (!kp) throw new Error(`Missing keypair for ${contractAddress}`);
      return unseal(kp, ciphertext);
    },

    serializeKeypairs() {
      const stringKeypairs: ExportedContractKeypairs = {};
      Object.keys(contractKeypairs).forEach((contractAddress) => {
        const signature = contractKeypairs[contractAddress].signature;
        if (!signature) return;
        stringKeypairs[contractAddress] = {
          signature,
          publicKey: toHexString(contractKeypairs[contractAddress].publicKey),
          privateKey: toHexString(contractKeypairs[contractAddress].privateKey),
        };
      });
      return stringKeypairs;
    },
  };
};

export * from "../extensions/access_control"