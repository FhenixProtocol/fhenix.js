import sodium from 'libsodium-wrappers';
import { toHexString, isAddress } from '../../../utils';
import { ContractKeypair, SupportedProvider, determineRequestMethod, determineRequestSigner } from '../../../sdk/types';
import { EIP712 } from '../EIP712';

export type Permit = {
  contractAddress: string,
  keypair: ContractKeypair;
  publicKey: string
};

export const getPermit = async (contract: string, provider: SupportedProvider): Promise<Permit> => {
  if (!contract || contract.trim() === "") {
    throw new Error(`Missing contract address`);
  }
  if (!isAddress(contract)) {
    throw new Error('Invalid contract address');
  }
  if (!provider) {
    throw new Error(`Missing provider`);
  }


  let savedPermit = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    savedPermit = window.localStorage.getItem(`Fhenix_saved_permit_${contract}`);
  }

  if (savedPermit) {
    const o = JSON.parse(savedPermit) as Permit;
    if (o) { 
      const permit : Permit = {
        contractAddress: o.contractAddress,
        keypair: {
          publicKey: new Uint8Array(Object.values(o.keypair.publicKey)),
          privateKey: new Uint8Array(Object.values(o.keypair.privateKey)),
          signature: o.keypair.signature
        },
        publicKey: o.publicKey
      }
      return permit;
    }
  } 
  return generatePermit(contract, provider);
}

const sign = async (signer: any, domain: any, types: any, value: any): Promise<string> => {
  if ('_signTypedData' in signer && typeof signer._signTypedData == 'function') {
    return await signer._signTypedData(domain, types, value);
  } else if ('signTypedData' in signer && typeof signer.signTypedData == 'function') {
    return await signer.signTypedData(domain, types, value);
  }
  throw new Error('Unsupported signer');
}

export const generatePermit = async (contract: string, provider: SupportedProvider): Promise<Permit> => {
  if (!provider) {
    throw new Error('Provider is undefined');
  }

  const requestMethod = determineRequestMethod(provider);

  const getSigner = determineRequestSigner(provider);
  const signer = await getSigner(provider);

  const chainId = await requestMethod(provider, "eth_chainId", [ ]);

  const keypair = sodium.crypto_box_keypair(); // params.keypair || 
  const msgParams: EIP712 = {
    types: {
      // This refers to the domain the contract is hosted on.
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      // Refer to primaryType.
      Reencrypt: [{ name: 'publicKey', type: 'bytes32' }],
    },
    // This defines the message you're proposing the user to sign, is dapp-specific, and contains
    // anything you want. There are no required fields. Be as explicit as possible when building out
    // the message schema.
    // This refers to the keys of the following types object.
    primaryType: 'Reencrypt',
    domain: {
      // Give a user-friendly name to the specific contract you're signing for.
      name: 'Authorization permit', // params.name
      // This identifies the latest version.
      version: '1', //params.version ||
      // This defines the network, in this case, Mainnet.
      chainId: chainId,
      // // Add a verifying contract to make sure you're establishing contracts with the proper entity.
      verifyingContract: contract //params.verifyingContract,
    },
    message: {
      publicKey: `0x${toHexString(keypair.publicKey)}`,
    },
  };

  const msgSig = await sign(signer, msgParams.domain, 
    { Reencrypt: msgParams.types.Reencrypt }, 
    msgParams.message
  );

  const permit : Permit = {
    contractAddress: contract,
    keypair: {
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
      signature: msgSig
    },
    publicKey: `0x${toHexString(keypair.publicKey)}`
    //permit: msgParams,
    //msgSig
  };
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(`Fhenix_saved_permit_${contract}`, JSON.stringify(permit));
  }
  return permit;
};
