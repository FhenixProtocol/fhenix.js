/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from "zustand/vanilla";
import { produce } from "immer";
import { TfheCompactPublicKey } from "../../sdk/fhe/fhe";
import { fromHexString, toABIEncodedUint32 } from "../../sdk/utils";
import { FheOpsAddress, PUBLIC_KEY_LENGTH_MIN } from "../../sdk/consts";
import { AbstractProvider, AbstractSigner } from "../../sdk/types";

type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;

type SdkStore = {
  initialized: boolean;
  fhevmInitialized: boolean;
  fheKeysInitialized: boolean;

  securityZones: number[];
  fheKeys: ChainRecord<SecurityZoneRecord<Uint8Array | undefined>>;

  provider?: AbstractProvider;
  signer?: AbstractSigner;
  account?: string;
  chainId?: string;
};

export const _sdkStore = createStore<SdkStore>(
  () =>
    ({
      initialized: false,
      fhevmInitialized: false,
      fheKeysInitialized: false,

      securityZones: [0],
      fheKeys: {},

      provider: undefined,
      signer: undefined,
      account: undefined,
      chainId: undefined,
    }) as SdkStore,
);

// Store getters / setters

export const _store_getFheKey = (
  chainId: string | undefined,
  securityZone: number | undefined,
): TfheCompactPublicKey | undefined => {
  if (chainId == null || securityZone == null) return undefined;

  const serialized = _sdkStore.getState().fheKeys[chainId]?.[securityZone];
  if (serialized == null) return undefined;

  return TfheCompactPublicKey.deserialize(serialized);
};

export const _store_getConnectedChainFheKey = (
  securityZone: number | undefined,
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
};

export const _store_initialize = async (init: InitParams) => {
  const { provider, signer, securityZones = [0] } = init;

  _sdkStore.setState({ initialized: false });

  // PROVIDER

  // Account is fetched and stored here, the `account` field in the store is used to index which permits belong to which users
  // In sdk functions, `state.account != null` is validated, this is a check to ensure that a valid signer has been provided
  //   which is necessary to interact with permits
  const account = await signer?.getAddress();
  _sdkStore.setState({ provider, signer, account });

  const chainId = await getChainIdFromProvider(provider);

  // If chainId or securityZones changes, update the store and flag fheKeys for re-initialization
  if (
    chainId !== _sdkStore.getState().chainId ||
    securityZones !== _sdkStore.getState().securityZones
  )
    _sdkStore.setState({
      chainId,
      securityZones,
      fheKeysInitialized: false,
    });

  // FHE KEYS

  await Promise.all(
    securityZones.map((securityZone) =>
      _store_fetchFheKey(chainId, provider, securityZone),
    ),
  );

  _sdkStore.setState({ fheKeysInitialized: true, initialized: true });
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

  const publicKey = await provider
    .call({ to: FheOpsAddress, data: callData })
    .catch((err: Error) => {
      throw Error(
        `Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(
          err,
        )}`,
      );
    });

  if (typeof publicKey !== "string") {
    throw new Error("Error using publicKey from provider: expected string");
  }

  if (publicKey.length < PUBLIC_KEY_LENGTH_MIN) {
    throw new Error(
      `Error initializing fhenixjs; got shorter than expected public key: ${publicKey.length}`,
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
