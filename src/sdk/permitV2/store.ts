import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { SerializedPermitV2 } from "../types";
import { PermitV2 } from "./permitV2";

type AccountRecord<T> = Record<string, T>;
type HashRecord<T> = Record<string, T>;

type PermitsStore = {
  permits: AccountRecord<HashRecord<SerializedPermitV2 | undefined>>;
  activePermitHash: AccountRecord<string | undefined>;
};

// Stores generated permits for each user, a hash indicating the active permit for each user, and a list of fheKeys as a cache
// Can be used to create reactive hooks
export const permitsStore = createStore<PermitsStore>()(
  persist(
    () => ({
      permits: {},
      activePermitHash: {},
    }),
    { name: "fhenix.js" },
  ),
);

// Permit V2

export const getPermit = (
  account: string | undefined,
  hash: string | undefined,
): PermitV2 | undefined => {
  if (account == null || hash == null) return;

  const savedPermit = permitsStore.getState().permits[account]?.[hash];
  if (savedPermit == null) return;

  return PermitV2.deserialize(savedPermit);
};

export const getActivePermit = (
  account: string | undefined,
): PermitV2 | undefined => {
  if (account == null) return;

  const activePermitHash = permitsStore.getState().activePermitHash[account];
  return getPermit(account, activePermitHash);
};

export const getPermits = (
  account: string | undefined,
): Record<string, PermitV2> => {
  if (account == null) return {};

  return Object.entries(permitsStore.getState().permits[account] ?? {}).reduce(
    (acc, [hash, permit]) => {
      if (permit == undefined) return acc;
      return { ...acc, [hash]: PermitV2.deserialize(permit) };
    },
    {} as Record<string, PermitV2>,
  );
};

export const setPermit = (account: string, permitV2: PermitV2) => {
  permitsStore.setState(
    produce<PermitsStore>((state) => {
      if (state.permits[account] == null) state.permits[account] = {};
      state.permits[account][permitV2.getHash()] = permitV2.serialize();
    }),
  );
};

export const removePermit = (account: string, hash: string) => {
  permitsStore.setState(
    produce<PermitsStore>((state) => {
      state.permits[account][hash] = undefined;
    }),
  );
};

// Active Permit Hash

export const getActivePermitHash = (
  account: string | undefined,
): string | undefined => {
  if (account == null) return undefined;
  return permitsStore.getState().activePermitHash[account];
};

export const setActivePermitHash = (account: string, hash: string) => {
  permitsStore.setState(
    produce<PermitsStore>((state) => {
      state.activePermitHash[account] = hash;
    }),
  );
};

export const removeActivePermitHash = (account: string) => {
  permitsStore.setState(
    produce<PermitsStore>((state) => {
      state.activePermitHash[account] = undefined;
    }),
  );
};
