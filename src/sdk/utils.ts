import { Buffer } from "buffer";

import {
  toBigInt as ethersToBigInt,
  toBeArray as ethersToBeArray,
  isAddress as ethersIsAddress,
} from "ethers";
import { isNumber } from "./validation";

export const ValidateUintInRange = (
  value: number,
  max: number,
  min: number,
): void => {
  isNumber(value);

  if (value > max || value < min) {
    throw new Error(
      `Value out of range: ${max} - ${min}, try a different uint type`,
    );
  }
};

export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, "").match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

export const numberToBytes = (uint32Value: number) => {
  const byteArrayLength = Math.ceil(Math.log2(uint32Value + 1) / 8);
  const byteArray = new Uint8Array(byteArrayLength);

  for (let i = byteArrayLength - 1; i >= 0; i--) {
    byteArray[i] = uint32Value & 0xff;
    uint32Value >>= 8;
  }

  return byteArray;
};

export const bytesToNumber = function (byteArray: Uint8Array): number {
  if (!byteArray || byteArray?.length === 0) {
    return 0;
  }

  const length = byteArray.length;

  const buffer = Buffer.from(byteArray);
  const result = buffer.readUIntBE(0, length);

  return result;
};

export function toBigInt(value: Uint8Array): bigint {
  return ethersToBigInt(value);
}

export function toBeArray(value: bigint | number): Uint8Array {
  return ethersToBeArray(value);
}

export function isAddress(address: string) {
  if (!ethersIsAddress(address)) {
    throw new Error(`Address ${address} is not valid EVM address`);
  }
}
