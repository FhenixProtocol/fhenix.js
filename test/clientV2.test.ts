/**
 * @vitest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it } from "vitest";
import {
  FhenixClient,
  FhenixClientSync,
  GenerateSealingKey,
  getPermit,
  Permit,
  SealingKey,
} from "../lib/esm";
import { createTfhePublicKey } from "./keygen";
import { MockProvider } from "./utils";
import { afterEach } from "vitest";
import { getAllExistingPermits } from "../src/fhenix";
import { FhenixClientV2 } from "../src/sdk/clientV2";

describe("PermitV2 Tests", () => {
  let tfhePublicKey: string;
  let provider: MockProvider;
  let signerAddress: string;
  const contractAddress = "0x1c786b8ca49D932AFaDCEc00827352B503edf16c";
  const contractAddress2 = "0xB170fC5BAC4a87A63fC84653Ee7e0db65CC62f96";
  const projectId = "COUNTER";
  const projectId2 = "UNISWAP";

  const createClient = async (provider: MockProvider) => {
    const client = new FhenixClientV2();

    await client.initialize({
      account: await (await provider.getSigner()).getAddress(),
      send: provider.send,
      signTypedData: (await provider.getSigner())._signTypedData,
    });

    return client;
  };

  beforeAll(async () => {
    tfhePublicKey = createTfhePublicKey();
    provider = new MockProvider(tfhePublicKey);
    signerAddress = await (await provider.getSigner()).getAddress();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be in jsdom environment", async () => {
    expect(typeof window).not.toBe("undefined");
  });

  it("creates an instance", async () => {
    const client = new FhenixClientV2();

    expect(client.fhevmInitialized).to.eq(false);
    expect(client.fhePublicKeysInitialized).to.eq(false);
    expect(client.account).to.eq(undefined);
    expect(client.chainId).to.eq(undefined);
    expect(client.securityZones).to.eq(undefined);

    const account = await (await provider.getSigner()).getAddress();

    await client.initialize({
      account,
      send: provider.send,
      signTypedData: (await provider.getSigner())._signTypedData,
    });

    expect(client.fhevmInitialized).to.eq(true);
    expect(client.fhePublicKeysInitialized).to.eq(true);
    expect(client.account).to.eq(account);
    expect(client.chainId).to.eq(provider.chainId);
    expect(client.securityZones).to.eq([0]);
  });

  // Core
  it("re-initialize");
  it("multiple clients");

  // Encrypt
  it("encrypt");

  // Permit
  it("createPermit");
  it("createPermitAsRecipient");
  it("usePermit");
  it("importPermit");
  it("getPermit");
  it("getPermission");
  it("getAllPermits");

  // Unseal
  it("unseal");

  // Integration
  it("sharing");
});
