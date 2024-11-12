import { PermitV2, PermitV2Options, SignTypedDataFn } from "../../types.js";
import {
  getPermit,
  getPermits,
  getPermitV2Hash,
  setActivePermitHash,
  setPermit,
} from "../../store.js";
import { generatePermitV2 } from "./generate.js";

export const getPermitV2 = async (
  account: string,
  chainId: string,
  options: PermitV2Options,
  signTypedData: (
    domain: object,
    types: object,
    value: object,
  ) => Promise<string>,
  autoGenerate: boolean = true,
): Promise<PermitV2 | null> => {
  const hash = getPermitV2Hash(options);
  const savedPermit = getPermit(account, hash);

  const timestamp = Math.floor(Date.now() / 1000);
  if (savedPermit != null && savedPermit.expiration > timestamp)
    return savedPermit;

  return autoGenerate
    ? generateAndStorePermitV2(account, chainId, options, signTypedData)
    : null;
};

export const generateAndStorePermitV2 = async (
  account: string,
  chainId: string,
  options: PermitV2Options,
  signTypedData: SignTypedDataFn,
): Promise<PermitV2> => {
  const permitV2 = await generatePermitV2(chainId, options, signTypedData);

  setPermit(account, permitV2);
  setActivePermitHash(account, getPermitV2Hash(permitV2));

  return permitV2;
};

export const getAllExistingPermitV2s = (account: string) => getPermits(account);
