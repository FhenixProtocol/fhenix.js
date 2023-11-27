import {
  FheUint8,
  FheUint16,
  FheUint32,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
  TfheCompactPublicKey,
  TfheClientKey,
} from 'node-tfhe';
import { createTfheKeypair } from '../tfhe';
import { encrypt_uint8, encrypt_uint16, encrypt_uint32, encrypt } from './encrypt';
import { UintTypes } from '.';

describe('encrypt_uint8', () => {
  let clientKey: TfheClientKey;
  let publicKey: TfheCompactPublicKey;

  beforeAll(async () => {
    const keypair = createTfheKeypair();
    clientKey = keypair.clientKey;
    publicKey = keypair.publicKey;
  });

  it('encrypt_uint8/decrypt 0 8bits', async () => {
    const buffer = encrypt_uint8(0, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
    });
  });

  it('encrypt_uint8/decrypt 8bits', async () => {
    const buffer = encrypt_uint8(34, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(34);
    });
  });

  it('encrypt_uint16/decrypt 0 16bits', async () => {
    const buffer = encrypt_uint16(0, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
    });
  });

  it('encrypt_uint16/decrypt 16bits', async () => {
    const buffer = encrypt_uint16(434, publicKey);
    const compactList = CompactFheUint16List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint16) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(434);
    });
  });

  it('encrypt_uint32/decrypt 0 32bits', async () => {
    const buffer = encrypt_uint32(0, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
    });
  });

  it('encrypt_uint32/decrypt 32bits', async () => {
    const buffer = encrypt_uint32(30210, publicKey);
    const compactList = CompactFheUint32List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint32) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(30210);
    });
  });


  
  it('encrypt/decrypt 0 8bits', async () => {
    const buffer = encrypt(0, publicKey, UintTypes.uint8);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
    });
  });

  it('encrypt/decrypt 8bits', async () => {
    const buffer = encrypt(34, publicKey, UintTypes.uint8);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(34);
    });
  });

  it('encrypt/decrypt 0 16bits', async () => {
    const buffer = encrypt(0, publicKey, UintTypes.uint16);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
    });
  });

  it('encrypt/decrypt 16bits', async () => {
    const buffer = encrypt(434, publicKey, UintTypes.uint16);
    const compactList = CompactFheUint16List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint16) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(434);
    });
  });

  it('encrypt/decrypt 0 32bits', async () => {
    const buffer = encrypt(0, publicKey, UintTypes.uint32);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
    });
  });

  it('encrypt/decrypt 32bits', async () => {
    const buffer = encrypt(30210, publicKey, UintTypes.uint32);
    const compactList = CompactFheUint32List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint32) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(30210);
    });
  });
});
