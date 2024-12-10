import { expect, describe, it } from "vitest";
import { GenerateSealingKey, SealingKey } from "../lib/esm";
import { fromHexString } from "./utils";

describe("tests sealing and unsealing using SealingKey", () => {
  it("decrypts a hex value", async () => {
    const keypair = await GenerateSealingKey();

    const value = 28482;
    const ciphertext = SealingKey.seal(value, keypair.publicKey);
    const cleartext = keypair.unseal(ciphertext);
    expect(cleartext).toBe(BigInt(value));
  });

  it("decrypts a Uint8Array value", async () => {
    const keypair = await GenerateSealingKey();

    const value = 1;
    const ciphertext = SealingKey.seal(value, keypair.publicKey);
    const cleartext = keypair.unseal(fromHexString(ciphertext));
    expect(cleartext).toBe(BigInt(value));
  });
});
