import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SerializedPermitV2 } from "./types";
import { TfheCompactPublicKey } from "../sdk/fhe/fhe";
import { PermitV2 } from "../sdk/permitV2";

type AccountRecord<T> = Record<string, T>;
type HashRecord<T> = Record<string, T>;
type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;

type PersistState = {
  permits: AccountRecord<HashRecord<SerializedPermitV2 | undefined>>;
  activePermitHash: AccountRecord<string | undefined>;
  fheKeys: ChainRecord<SecurityZoneRecord<Uint8Array | undefined>>;
};

// Stores generated permits for each user, a hash indicating the active permit for each user, and a list of fheKeys as a cache
// Can be used to create reactive hooks
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

export const getPermit = (
  account: string | undefined,
  hash: string | undefined,
): PermitV2 | undefined => {
  if (account == null || hash == null) return;

  const savedPermit = useFhenixStore.getState().permits[account]?.[hash];
  if (savedPermit == null) return;

  return PermitV2.deserialize(savedPermit);
};

export const getActivePermit = (
  account: string | undefined,
): PermitV2 | undefined => {
  if (account == null) return;

  const activePermitHash = useFhenixStore.getState().activePermitHash[account];
  return getPermit(account, activePermitHash);
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
      return { ...acc, [hash]: PermitV2.deserialize(permit) };
    },
    {} as Record<string, PermitV2>,
  );
};

export const setPermit = (account: string, permitV2: PermitV2) => {
  useFhenixStore.setState((state) => ({
    permits: {
      ...state.permits,
      [account]: {
        ...state.permits[account],
        [permitV2.getHash()]: permitV2.serialize(),
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
