/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from "zustand/vanilla";
import { produce } from "immer";
import { TfheCompactPublicKey } from "../fhe/fhe";
import { chainIsHardhat, fromHexString, toABIEncodedUint32 } from "../utils";
import { FheOpsAddress, PUBLIC_KEY_LENGTH_MIN } from "../consts";
import { AbstractProvider, AbstractSigner } from "./types";

type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;

type PermitV2AccessRequirements = {
  contracts: string[];
  projects: string[];
};

type PermitV2AccessRequirementsParams =
  | {
      contracts?: never[];
      projects: string[];
    }
  | {
      contracts: string[];
      projects?: never[];
    };

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

      providerInitialized: false,
      provider: undefined as never,
      chainId: undefined as never,

      signerInitialized: false,
      signer: undefined as never,
      account: undefined as never,
    }) as SdkStore,
);

// Store getters / setters

export const _store_chainId = (): string | undefined =>
  _sdkStore.getState().chainId;

export const _store_getFheKey = (
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

export type InitParams = {
  provider: AbstractProvider;
  signer?: AbstractSigner;
  securityZones?: number[];
} & PermitV2AccessRequirementsParams;

export const _store_initialize = async (params: InitParams) => {
  const {
    provider,
    signer,
    securityZones = [0],
    contracts: contractRequirements = [],
    projects: projectRequirements = [],
  } = params;

  _sdkStore.setState({
    providerInitialized: false,
    signerInitialized: false,
    accessRequirements: {
      contracts: contractRequirements,
      projects: projectRequirements,
    },
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

  // If chainId or securityZones changes, update the store and update fheKeys for re-initialization
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
        _store_fetchFheKey(chainId, provider, securityZone),
      ),
    );
  }

  _sdkStore.setState({ fheKeysInitialized: true });
};

/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {string} chainId - The chain to fetch the FHE key for, if no chainId provided, undefined is returned
 * @param {Provider} provider - EthersV6 Provider that performs the key fetch.
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
export const _store_fetchFheKey = async (
  chainId: string,
  provider: AbstractProvider,
  securityZone: number = 0,
): Promise<TfheCompactPublicKey> => {
  const storedKey = _store_getFheKey(chainId, securityZone);
  if (storedKey != null) return storedKey;

  const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
  const callData = funcSig + toABIEncodedUint32(securityZone);

  const publicKey = await provider.call({ to: FheOpsAddress, data: callData });

  if (typeof publicKey !== "string") {
    throw new Error(
      "Error initializing fhenixjs; FHE publicKey fetched from provider invalid: not a string",
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

  // todo (eshel) verify this
  // magically know how to decode rlp or w/e returns from the evm json-rpc
  const buff = fromHexString(publicKey.slice(130));

  try {
    const key = TfheCompactPublicKey.deserialize(buff);
    _store_setFheKey(chainId, securityZone, key);
    return key;
  } catch (err) {
    throw new Error(`Error deserializing public key ${err}`);
  }
};
