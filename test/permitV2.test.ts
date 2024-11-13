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
import { PermitV2 } from "../src/sdk/permitV2";

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

  it("create (self)", async () => {
    PermitV2.create({
      type: "self",
      issuer: signerAddress,
    });
  });
  it("create (sharing)");
  it("create (recipient)");
  it("sharing integration");

  it("getInterface");
  it("getPermission");
  it("getHash");

  it("sign");
  it("unseal");

  it("isValid");

  it("deserialize");
  it("serialize");
});
