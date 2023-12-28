import { TfheCompactPublicKey } from 'node-tfhe';
import sodium from 'libsodium-wrappers';
import { isAddress, fromHexString } from './utils';
import {
  ContractPermits,
  determineRequestMethod,
  InstanceParams,
  SupportedProvider,
  EncryptionTypes
} from './types';
import { assert } from '@sindresorhus/is';
import { AbiCoder, Interface, JsonRpcProvider } from 'ethers';

import { FheOpsAddress, MAX_UINT16, MAX_UINT32, MAX_UINT8 } from './consts';
import { Permit } from '../extensions/access_control';
import { ValidateUintInRange } from './utils';
import * as tfheEncrypt from './encrypt';

export class FhenixClient {
  private permits: ContractPermits = {};
  private fhePublicKey: TfheCompactPublicKey | undefined = undefined;

  private constructor() {}

  // **************** Class creation

  public static Create = async (params: InstanceParams) => {
    assert.plainObject(params)
    //assert.object(params.provider)

    if (params?.provider === undefined) {
      params.provider = new JsonRpcProvider("http://localhost:8545")
    }

    // in most cases we will want to init the fhevm library - except if this is used outside of the browser, in which
    // case this should be called with initSdk = false (tests, for instance)
    if (params?.initSdk !== false) {
      const { initFhevm } = await import ('./init');
      await initFhevm();
    }

    await sodium.ready;

    const client = new FhenixClient();

    const { provider } = params;

    client.fhePublicKey = await this.getFheKeyFromProvider(provider);

    return client;
  }

  // *********************** Encryption

  encrypt_uint8(value: number) {
    assert.number(value);
    if (!this.fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }
    ValidateUintInRange(value, MAX_UINT8, 0);
    return tfheEncrypt.encrypt_uint8(value, this.fhePublicKey);
  };

  encrypt_uint16(value: number) {
    assert.number(value);
    if (!this.fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }
    ValidateUintInRange(value, MAX_UINT16, 0);
    return tfheEncrypt.encrypt_uint16(value, this.fhePublicKey);
  };
  encrypt_uint32(value: number) {
    assert.number(value);
    if (!this.fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }
    ValidateUintInRange(value, MAX_UINT32, 0);
    return tfheEncrypt.encrypt_uint32(value, this.fhePublicKey);
  };
  encrypt(value: number, type?: EncryptionTypes) {
    assert.number(value);

    let outputSize = type;

    if (!this.fhePublicKey) {
      throw new Error("Public key somehow not initialized");
    }

    // choose the most efficient ciphertext size if not selected
    if (!outputSize) {
      if (value < MAX_UINT8) {
        outputSize = EncryptionTypes.uint8;
      } else       if (value < MAX_UINT8) {
        outputSize = EncryptionTypes.uint8;
      } else       if (value < MAX_UINT8) {
        outputSize = EncryptionTypes.uint8;
      } else {
        throw new Error(`Encryption input must be smaller than ${MAX_UINT32}`);
      }
    }

    switch (outputSize) {
      case EncryptionTypes.uint8:
        ValidateUintInRange(value, MAX_UINT8, 0);
        break;
      case EncryptionTypes.uint16:
        ValidateUintInRange(value, MAX_UINT16, 0);
        break;
      case EncryptionTypes.uint32:
        ValidateUintInRange(value, MAX_UINT32, 0);
        break;
    }

    return tfheEncrypt.encrypt(value, this.fhePublicKey, type);
  }

  // ************************ Unsealing

  unseal(contractAddress: string, ciphertext: string) {
    isAddress(contractAddress);
    assert.string(ciphertext);

    if (!this.hasPermit(contractAddress)) {
      throw new Error(`Missing keypair for ${contractAddress}`);
    }

    return this.permits[contractAddress].sealingKey.unseal(ciphertext);
  };

  // ******************* Permit functions
  getPermit(contractAddress: string) {
    if (!this.hasPermit(contractAddress)) {
      throw new Error(`Missing keypair for ${contractAddress}`);
    }

    return this.permits[contractAddress];
  }

  storePermit(permit: Permit) {
      this.permits[permit.contractAddress] = permit
  }
  hasPermit(contractAddress: string) {
    return (
      this.permits[contractAddress] !== null
    );
  };

  exportPermits() {
    return this.permits;
  };

  private static async getFheKeyFromProvider(provider: SupportedProvider) {
    const requestMethod = determineRequestMethod(provider);

    const chainIdP = requestMethod(provider, 'eth_chainId').catch((err: Error) => {
      throw Error(`Error while requesting chainId from provider: ${err}`);
    });

    const networkPkAbi = new Interface(['function getNetworkPublicKey()']);
    const callData = networkPkAbi.encodeFunctionData('getNetworkPublicKey');
    const callParams = [{ to: FheOpsAddress, data: callData }, 'latest'];

    const publicKeyP = requestMethod(provider, 'eth_call', callParams).catch((err: Error) => {
      throw Error(`Error while requesting network public key from provider: ${JSON.stringify(err)}`);
    });

    const [chainId, publicKey] = await Promise.all([chainIdP, publicKeyP]);

    const chainIdNum: number = parseInt(chainId, 16);
    if (isNaN(chainIdNum)) {
      throw new Error(`received non-hex number from chainId request: "${chainId}"`);
    }

    if (typeof publicKey !== 'string') {
      throw new Error('Error using publicKey from provider: expected string');
    }

    const abiCoder = AbiCoder.defaultAbiCoder();
    const publicKeyDecoded = abiCoder.decode(['bytes'], publicKey)[0];
    const buff = fromHexString(publicKeyDecoded);

    try {
      return TfheCompactPublicKey.deserialize(buff);
    } catch (err) {
      throw new Error(`Error deserializing public key: did you initialize fhenix.js with "initFhevm()"? ${err}`);
    }
  }

}
