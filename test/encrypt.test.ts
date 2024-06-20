// import {
//
//   createTfheKeypair
// } from "@fhenixprotocol/tfhe-keys";
import {
  CompactFheUint8,
  CompactFheUint16,
  CompactFheUint32,
  CompactFheUint64,
  CompactFheUint128,
  CompactFheUint160,
  CompactFheUint256,
  TfheClientKey,
} from "../lib/esm/sdk/fhe/fhe";
import {
  createTfheKeypair
} from "./keygen";
import {
  encrypt_uint8,
  encrypt_uint16,
  encrypt_uint32,
  encrypt,
  encrypt_uint64,
  encrypt_uint128,
  encrypt_uint256,
  encrypt_address,
} from "../lib/esm/sdk/encrypt";
import { EncryptionTypes } from "../lib/esm";
import { assert, expect, test, describe, it, beforeAll } from "vitest";

describe("encrypt_uint8", () => {
  let clientKey: TfheClientKey;
  let publicKey;

  beforeAll(async () => {
    const keypair = createTfheKeypair();
    clientKey = keypair.clientKey;
    publicKey = keypair.publicKey;
  });

  it("encrypt_uint8/decrypt 0 8bits", async () => {
    const buffer = encrypt_uint8(0, publicKey);
    const compact = CompactFheUint8.deserialize(buffer.data);
    const encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(0);
  });

  it("encrypt_uint8/decrypt 8bits", async () => {
    const buffer = encrypt_uint8(34, publicKey);
    const compact = CompactFheUint8.deserialize(buffer.data);
    const encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(34);
  });

  it("encrypt_uint16/decrypt 0 16bits", async () => {
    const buffer = encrypt_uint16(0, publicKey);
    const compact = CompactFheUint8.deserialize(buffer.data);
    const encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(0);
  });

  it("encrypt_uint16/decrypt 16bits", async () => {
    const buffer = encrypt_uint16(434, publicKey);
    const compact = CompactFheUint16.deserialize(buffer.data);
    const encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(434);
  });

  it("encrypt_uint32/decrypt 0 32bits", async () => {
    const buffer = encrypt_uint32(0, publicKey);
    const compact = CompactFheUint8.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(0);
  });

  it("encrypt_uint32/decrypt 32bits", async () => {
    const buffer = encrypt_uint32(30210, publicKey);
    const compact = CompactFheUint32.deserialize(buffer.data);
    const encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(30210);
  });

  it("encrypt_uint64/decrypt 64bits", async () => {
    const buffer = encrypt_uint64("222222222", publicKey);
    const compact = CompactFheUint64.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted.toString(16)).toBe("222222222");
  });

  it("encrypt_uint128/decrypt 128bits", async () => {
    const buffer = encrypt_uint128("222222222333333333333", publicKey);
    const compact = CompactFheUint128.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted.toString(16)).toBe("222222222333333333333");
  });

  it("encrypt_uint256/decrypt 256bits", async () => {
    const buffer = encrypt_uint256(
      "2222222223333333333334444444444444444",
      publicKey,
    );
    const compact = CompactFheUint256.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted.toString(16)).toBe(
      "2222222223333333333334444444444444444",
    );
  });
  it("encrypt_address/decrypt address", async () => {
    const buffer = encrypt_address(
      "0x324234AF23a816AA9165de162b1b0d3D40eA1234",
      publicKey,
    );
    const compact = CompactFheUint160.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted.toString(16).toUpperCase()).toBe(
      "324234AF23a816AA9165de162b1b0d3D40eA1234".toUpperCase(),
    );
  });

  it("encrypt/decrypt 0 8bits", async () => {
    const buffer = encrypt(0, publicKey, EncryptionTypes.uint8);
    const compact = CompactFheUint8.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(0);
  });

  it("encrypt/decrypt 8bits", async () => {
    const buffer = encrypt(34, publicKey, EncryptionTypes.uint8);
    const compact = CompactFheUint8.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(34);
  });

  it("encrypt/decrypt 0 16bits", async () => {
    const buffer = encrypt(0, publicKey, EncryptionTypes.uint16);
    const compact = CompactFheUint16.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(0);
  });

  it("encrypt/decrypt 16bits", async () => {
    const buffer = encrypt(434, publicKey, EncryptionTypes.uint16);
    const compact = CompactFheUint16.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(434);
  });

  it("encrypt/decrypt 0 32bits", async () => {
    const buffer = encrypt(0, publicKey, EncryptionTypes.uint32);
    const compact = CompactFheUint32.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(0);
  });

  it("encrypt/decrypt 32bits", async () => {
    const buffer = encrypt(30210, publicKey, EncryptionTypes.uint32);
    const compact = CompactFheUint32.deserialize(buffer.data);
    let encrypted = compact.expand();
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(30210);
  });
});
