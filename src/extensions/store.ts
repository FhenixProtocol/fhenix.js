import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { SerializedPermitV2 } from "./types";
import { TfheCompactPublicKey } from "../sdk/fhe/fhe";
import { PermitV2 } from "../sdk/permitV2";
import { produce } from "immer";

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
export const fhenixjsStore = createStore<PersistState>()(
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

  const savedPermit = fhenixjsStore.getState().permits[account]?.[hash];
  if (savedPermit == null) return;

  return PermitV2.deserialize(savedPermit);
};

export const getActivePermit = (
  account: string | undefined,
): PermitV2 | undefined => {
  if (account == null) return;

  const activePermitHash = fhenixjsStore.getState().activePermitHash[account];
  return getPermit(account, activePermitHash);
};

export const getPermits = (
  account: string | undefined,
): Record<string, PermitV2> => {
  if (account == null) return {};

  return Object.entries(fhenixjsStore.getState().permits[account] ?? {}).reduce(
    (acc, [hash, permit]) => {
      if (permit == undefined) return acc;
      return { ...acc, [hash]: PermitV2.deserialize(permit) };
    },
    {} as Record<string, PermitV2>,
  );
};

export const setPermit = (account: string, permitV2: PermitV2) => {
  fhenixjsStore.setState(
    produce<PersistState>((state) => {
      if (state.permits[account] == null) state.permits[account] = {};
      state.permits[account][permitV2.getHash()] = permitV2.serialize();
    }),
  );
};

export const removePermit = (account: string, hash: string) => {
  fhenixjsStore.setState(
    produce<PersistState>((state) => {
      state.permits[account][hash] = undefined;
    }),
  );
};

export const getActivePermitHash = (
  account: string | undefined,
): string | undefined => {
  if (account == null) return undefined;
  return fhenixjsStore.getState().activePermitHash[account];
};

export const setActivePermitHash = (account: string, hash: string) => {
  fhenixjsStore.setState(
    produce<PersistState>((state) => {
      state.activePermitHash[account] = hash;
    }),
  );
};

export const removeActivePermitHash = (account: string) => {
  fhenixjsStore.setState(
    produce<PersistState>((state) => {
      state.activePermitHash[account] = undefined;
    }),
  );
};

export const getFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
): TfheCompactPublicKey | undefined => {
  if (chainId == null || securityZone == null) return undefined;

  const serialized = fhenixjsStore.getState().fheKeys[chainId]?.[securityZone];
  if (serialized == null) return undefined;

  return TfheCompactPublicKey.deserialize(serialized);
};

export const setFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
  fheKey: TfheCompactPublicKey | undefined,
) => {
  if (chainId == null || securityZone == null) return;

  fhenixjsStore.setState(
    produce<PersistState>((state) => {
      if (state.fheKeys[chainId] == null) state.fheKeys[chainId] = {};
      state.fheKeys[chainId][securityZone] = fheKey?.serialize();
    }),
  );
};

export const removeFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
) => {
  if (chainId == null || securityZone == null) return;

  fhenixjsStore.setState(
    produce<PersistState>((state) => {
      state.fheKeys[chainId][securityZone] = undefined;
    }),
  );
};
