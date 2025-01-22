/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from "zustand/vanilla";
import { produce } from "immer";
import { TfheCompactPublicKey } from "./fhe/fhe";
import { fromHexString } from "./utils";
import { chainIsHardhat } from "./utils.hardhat";
import { PUBLIC_KEY_LENGTH_MIN } from "./consts";
import {
  AbstractProvider,
  AbstractSigner,
  InitializationParams,
  PermitV2AccessRequirements,
} from "../types";

type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;

type SdkStoreProviderInitialization =
  | {
      providerInitialized: false;
      signer: never;
      account: never;
    }
  | {
      providerInitialized: true;
      provider: AbstractProvider;
      chainId: string;
    };

type SdkStoreSignerInitialization =
  | {
      signerInitialized: false;
      signer: never;
      account: never;
    }
  | {
      signerInitialized: true;
      signer: AbstractSigner;
      account: string;
    };

export type SdkStore = SdkStoreProviderInitialization &
  SdkStoreSignerInitialization & {
    provider: AbstractProvider;
    chainId: string;

    fheKeysInitialized: boolean;

    securityZones: number[];
    fheKeys: ChainRecord<SecurityZoneRecord<Uint8Array | undefined>>;
    accessRequirements: PermitV2AccessRequirements;

    coFheUrl: string | undefined;
  };

export const _sdkStore = createStore<SdkStore>(
  () =>
    ({
      fheKeysInitialized: false,

      securityZones: [0],
      fheKeys: {},
      accessRequirements: {
        contracts: [],
        projects: [],
      },

      coFheUrl: undefined,

      providerInitialized: false,
      provider: undefined as never,
      chainId: undefined as never,

      signerInitialized: false,
      signer: undefined as never,
      account: undefined as never,
    }) as SdkStore,
);

// Store getters / setters

const _store_getFheKey = (
  chainId: string | undefined,
  securityZone = 0,
): TfheCompactPublicKey | undefined => {
  if (chainId == null || securityZone == null) return undefined;

  const serialized = _sdkStore.getState().fheKeys[chainId]?.[securityZone];
  if (serialized == null) return undefined;

  return TfheCompactPublicKey.deserialize(serialized);
};

export const _store_getConnectedChainFheKey = (
  securityZone = 0,
): TfheCompactPublicKey | undefined => {
  const state = _sdkStore.getState();

  if (securityZone == null) return undefined;
  if (state.chainId == null) return undefined;

  const serialized = state.fheKeys[state.chainId]?.[securityZone];
  if (serialized == null) return undefined;

  return TfheCompactPublicKey.deserialize(serialized);
};

export const _store_setFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
  fheKey: TfheCompactPublicKey | undefined,
) => {
  if (chainId == null || securityZone == null) return;

  _sdkStore.setState(
    produce<SdkStore>((state) => {
      if (state.fheKeys[chainId] == null) state.fheKeys[chainId] = {};
      state.fheKeys[chainId][securityZone] = fheKey?.serialize();
    }),
  );
};

const getChainIdFromProvider = async (
  provider: AbstractProvider,
): Promise<string> => {
  const chainId = await provider.getChainId();
  if (chainId == null)
    throw new Error(
      "sdk :: getChainIdFromProvider :: provider.getChainId returned a null result, ensure that your provider is connected to a network",
    );
  return chainId;
};

// External functionality

export const _store_initialize = async (params: InitializationParams) => {
  const {
    provider,
    signer,
    securityZones = [0],
    contracts: contractRequirements = [],
    projects: projectRequirements = [],
    coFheUrl = undefined,
  } = params;

  _sdkStore.setState({
    providerInitialized: false,
    signerInitialized: false,
    accessRequirements: {
      contracts: contractRequirements,
      projects: projectRequirements,
    },
    coFheUrl,
  });

  // PROVIDER

  // Fetch chain Id from provider
  const chainId = await getChainIdFromProvider(provider);
  const chainIdChanged =
    chainId != null && chainId !== _sdkStore.getState().chainId;
  if (chainId != null && provider != null) {
    _sdkStore.setState({ providerInitialized: true, provider, chainId });
  }

  // SIGNER

  // Account is fetched and stored here, the `account` field in the store is used to index which permits belong to which users
  // In sdk functions, `state.account != null` is validated, this is a check to ensure that a valid signer has been provided
  //   which is necessary to interact with permits
  const account = await signer?.getAddress();
  if (account != null && signer != null) {
    _sdkStore.setState({ signerInitialized: true, account, signer });
  } else {
    _sdkStore.setState({
      signerInitialized: false,
      account: undefined,
      signer: undefined,
    });
  }

  // If chainId, securityZones, or CoFhe enabled changes, update the store and update fheKeys for re-initialization
  const securityZonesChanged =
    securityZones !== _sdkStore.getState().securityZones;
  if (chainIdChanged || securityZonesChanged) {
    _sdkStore.setState({
      securityZones,
      fheKeysInitialized: false,
    });
  }

  // Fetch FHE keys (skipped if hardhat)
  if (!chainIsHardhat(chainId) && !_sdkStore.getState().fheKeysInitialized) {
    await Promise.all(
      securityZones.map((securityZone) =>
        _store_fetchFheKey(chainId, securityZone, true),
      ),
    );
  }

  _sdkStore.setState({ fheKeysInitialized: true });
};

/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {string} chainId - The chain to fetch the FHE key for, if no chainId provided, undefined is returned
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
export const _store_fetchFheKey = async (
  chainId: string,
  securityZone: number = 0,
  forceFetch = false,
): Promise<TfheCompactPublicKey> => {
  const storedKey = _store_getFheKey(chainId, securityZone);
  if (storedKey != null && !forceFetch) return storedKey;

  const coFheUrl = _sdkStore.getState().coFheUrl;
  if (coFheUrl == null || typeof coFheUrl !== "string") {
    throw new Error(
      "Error initializing fhenixjs; coFheUrl invalid, ensure it is set in `fhenixsdk.initialize`",
    );
  }

  let publicKey: string | undefined = undefined;

  // Fetch publicKey from CoFhe
  try {
    // TODO: misspelling?
    const res = await fetch(`${coFheUrl}/GetNetworkPublickKey`, {
      method: "POST",
      body: JSON.stringify({
        SecurityZone: securityZone,
      }),
    });

    const data = await res.json();

    publicKey = `0x${data.securityZone}`;
  } catch (err) {
    throw new Error(
      `Error initializing fhenixjs; fetching FHE publicKey from CoFHE failed with error ${err}`,
    );
  }

  if (publicKey == null || typeof publicKey !== "string") {
    throw new Error(
      `Error initializing fhenixjs; FHE publicKey fetched from CoFHE invalid: not a string`,
    );
  }

  if (publicKey === "0x") {
    throw new Error(
      "Error initializing fhenixjs; provided chain is not FHE enabled, no FHE publicKey found",
    );
  }

  if (publicKey.length < PUBLIC_KEY_LENGTH_MIN) {
    throw new Error(
      `Error initializing fhenixjs; got shorter than expected FHE publicKey: ${publicKey.length}. Expected length >= ${PUBLIC_KEY_LENGTH_MIN}`,
    );
  }

  const buff = fromHexString(publicKey);

  try {
    const key = TfheCompactPublicKey.deserialize(buff);
    _store_setFheKey(chainId, securityZone, key);
    return key;
  } catch (err) {
    throw new Error(`Error deserializing public key ${err}`);
  }
};
