import { JsonRpcProvider, AbiCoder } from "ethers";

// Initialize genesis accounts
const mnemonics = [
  "grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar", // account a
  "jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow", // account b
  "chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge", // account c
];

export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, "").match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForChainToStart(url: string) {
  while (true) {
    try {
      const client = new JsonRpcProvider(url);
      console.log(`connecting to ${url}...`);
      let networkId = await client.getNetwork();
      return Number(networkId.chainId);
    } catch (e) {
      console.log(`client not ready`);
    }
    await sleep(250);
  }
}

export class MockSigner {
  async _signTypedData(domain: any, types: any, value: any): Promise<any> {
    return "0x123";
  }
}

export class MockProvider {
  publicKey: any;
  chainId: any;

  constructor(pk: any, chainId?: any) {
    this.publicKey = pk;
    this.chainId = chainId || "0x10";
  }
  async send(
    method: string,
    params: any[] | Record<string, any>,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (method === "eth_chainId") {
        resolve(this.chainId);
      } else if (method === "eth_call") {
        //abi-encode public key as bytes:
        if (typeof this.publicKey === "string") {
          const abiCoder = new AbiCoder();
          const buff = fromHexString(this.publicKey);
          const encoded = abiCoder.encode(["bytes"], [buff]);
          resolve(encoded);
        } else {
          resolve(this.publicKey);
        }
      } else {
        reject("method not implemented");
      }
    });
  }

  async getSigner(): Promise<MockSigner> {
    return new MockSigner();
  }
}
