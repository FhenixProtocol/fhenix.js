import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PermissionV2,
  PermitV2,
  PermitV2Core,
  SerializedPermitV2,
} from "./types";
import { SealingKey } from "../sdk/sealing";
import { keccak256, ZeroAddress } from "ethers";
import { TfheCompactPublicKey } from "../sdk/fhe/fhe";

type AccountRecord<T> = Record<string, T>;
type HashRecord<T> = Record<string, T>;
type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;

type PersistState = {
  permits: AccountRecord<HashRecord<SerializedPermitV2 | undefined>>;
  activePermitHash: AccountRecord<string | undefined>;
  fheKeys: ChainRecord<SecurityZoneRecord<Uint8Array | undefined>>;
};

export const useFhenixStore = create<PersistState>()(
  persist(
    () => ({
      permits: {},
      activePermitHash: {},
      fheKeys: {},
    }),
    { name: "fhenix.js" },
  ),
);

const extractPermitPermission = ({
  sealingPair,
  ...permit
}: PermitV2): PermissionV2 => {
  return {
    ...permit,
    sealingKey: `0x${sealingPair.publicKey}`,
  };
};

const serializePermitV2 = (permitV2: PermitV2): SerializedPermitV2 => ({
  ...permitV2,
  sealingPair: {
    publicKey: permitV2.sealingPair.publicKey,
    privateKey: permitV2.sealingPair.privateKey,
  },
});

const parsePermitV2 = (permit: SerializedPermitV2): PermitV2 => {
  return {
    ...permit,
    sealingPair: new SealingKey(
      permit.sealingPair.privateKey,
      permit.sealingPair.publicKey,
    ),
  };
};

export const getPermitV2Hash = (permitV2: PermitV2Core): string => {
  return keccak256(
    JSON.stringify({
      issuer: permitV2.issuer,
      contracts: permitV2.contracts ?? [],
      projects: permitV2.projects ?? [],
      recipient: permitV2.recipient ?? ZeroAddress,
      validatorId: permitV2.validatorId ?? 0,
      validatorContract: permitV2.validatorContract ?? ZeroAddress,
    }),
  );
};

export const getPermit = (
  account: string | undefined,
  hash: string | undefined,
): PermitV2 | undefined => {
  if (account == null || hash == null) return;

  const savedPermit = useFhenixStore.getState().permits[account]?.[hash];
  if (savedPermit == null) return;

  return parsePermitV2(savedPermit);
};

export const getActivePermit = (
  account: string | undefined,
): PermitV2 | undefined => {
  if (account == null) return;

  const activePermitHash = useFhenixStore.getState().activePermitHash[account];
  return getPermit(account, activePermitHash);
};

export const getActivePermission = (
  account: string | undefined,
): PermissionV2 | undefined => {
  const permit = getActivePermit(account);
  if (permit == null) return;

  return extractPermitPermission(permit);
};

export const getPermission = (
  account: string | undefined,
  hash: string | undefined,
): PermissionV2 | undefined => {
  if (hash == null) return getActivePermission(account);

  const permit = getPermit(account, hash);
  if (permit == null) return;

  return extractPermitPermission(permit);
};

export const getPermits = (
  account: string | undefined,
): Record<string, PermitV2> => {
  if (account == null) return {};

  return Object.entries(
    useFhenixStore.getState().permits[account] ?? {},
  ).reduce(
    (acc, [hash, permit]) => {
      if (permit == undefined) return acc;
      return { ...acc, [hash]: parsePermitV2(permit) };
    },
    {} as Record<string, PermitV2>,
  );
};

export const setPermit = (account: string, permitV2: PermitV2) => {
  const hash = getPermitV2Hash(permitV2);
  useFhenixStore.setState((state) => ({
    permits: {
      ...state.permits,
      [account]: {
        ...state.permits[account],
        [hash]: serializePermitV2(permitV2),
      },
    },
  }));
};

export const removePermit = (account: string, hash: string) => {
  useFhenixStore.setState((state) => ({
    permits: {
      ...state.permits,
      [account]: {
        ...state.permits[account],
        [hash]: undefined,
      },
    },
  }));
};

export const getActivePermitHash = (
  account: string | undefined,
): string | undefined => {
  if (account == null) return undefined;
  return useFhenixStore.getState().activePermitHash[account];
};

export const setActivePermitHash = (account: string, hash: string) => {
  useFhenixStore.setState((state) => ({
    activePermitHash: {
      ...state.activePermitHash,
      [account]: hash,
    },
  }));
};

export const removeActivePermitHash = (account: string) => {
  useFhenixStore.setState((state) => ({
    activePermitHash: {
      ...state.activePermitHash,
      [account]: undefined,
    },
  }));
};

export const getFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
): TfheCompactPublicKey | undefined => {
  if (chainId == null || securityZone == null) return undefined;

  const serialized = useFhenixStore.getState().fheKeys[chainId]?.[securityZone];
  if (serialized == null) return undefined;

  return TfheCompactPublicKey.deserialize(serialized);
};

export const setFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
  fheKey: TfheCompactPublicKey | undefined,
) => {
  if (chainId == null || securityZone == null) return;

  useFhenixStore.setState((state) => ({
    fheKeys: {
      ...state.fheKeys,
      [chainId]: {
        ...state.fheKeys[chainId],
        [securityZone]: fheKey?.serialize(),
      },
    },
  }));
};

export const removeFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
) => {
  if (chainId == null || securityZone == null) return;

  useFhenixStore.setState((state) => ({
    fheKeys: {
      ...state.fheKeys,
      [chainId]: {
        ...state.fheKeys[chainId],
        [securityZone]: undefined,
      },
    },
  }));
};
