/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from "zustand/vanilla";
import { produce } from "immer";
import { TfheCompactPublicKey } from "../../sdk/fhe/fhe";
import { InitFhevm } from "../../sdk/init";
import { fromHexString, toABIEncodedUint32 } from "../../sdk/utils";
import { FheOpsAddress, PUBLIC_KEY_LENGTH_MIN } from "../../sdk/consts";
import { SendFn, SignTypedDataFn } from "../../sdk/types";

type ChainRecord<T> = Record<string, T>;
type SecurityZoneRecord<T> = Record<number, T>;

type SdkStore = {
  initialized: boolean;
  fhevmInitialized: boolean;
  fheKeysInitialized: boolean;

  securityZones: number[];
  fheKeys: ChainRecord<SecurityZoneRecord<Uint8Array | undefined>>;

  account?: string;
  chainId?: string;
  send?: SendFn;
  signTypedData?: SignTypedDataFn;
};

export const _sdkStore = createStore<SdkStore>(
  () =>
    ({
      initialized: false,
      fhevmInitialized: false,
      fheKeysInitialized: false,

      securityZones: [0],
      fheKeys: {},

      account: undefined,
      chainId: undefined,
      send: undefined,
      signTypedData: undefined,
    }) as SdkStore,
);

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

const getChainIdFromProvider = async (send: SendFn): Promise<string> => {
  const chainId = (await send("eth_chainId").catch((err: Error) => {
    throw Error(`Error while requesting chainId from provider: ${err}`);
  })) as string;

  if (isNaN(parseInt(chainId, 16))) {
    throw new Error(
      `received non-hex number from chainId request: "${chainId}"`,
    );
  }

  return chainId;
};

export type InitParams = {
  account: string;
  send: SendFn;
  signTypedData: SignTypedDataFn;
  securityZones?: number[];
  ignoreErrors?: boolean;
};

export const _store_initialize = async (init: InitParams) => {
  const {
    account,
    send,
    signTypedData,
    securityZones = [0],
    ignoreErrors,
  } = init;

  _sdkStore.setState({ initialized: false });

  // FHEVM

  if (!_sdkStore.getState().fhevmInitialized) {
    await InitFhevm().catch((err: unknown) => {
      if (ignoreErrors) {
        return undefined;
      } else {
        throw new Error(
          `initialize :: failed to initialize fhenixjs - is the network FHE-enabled? ${err}`,
        );
      }
    });
    _sdkStore.setState({ fhevmInitialized: true });
  }

  // PROVIDER

  _sdkStore.setState({ account, send, signTypedData });
  const chainId = await getChainIdFromProvider(send);

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
      _store_fetchFheKey(chainId, securityZone, send),
    ),
  );

  _sdkStore.setState({ fheKeysInitialized: true, initialized: true });
};

/**
 * Retrieves the FHE public key from the provider.
 * If the key already exists in the store it is returned, else it is fetched, stored, and returned
 * @param {SupportedProvider} provider - The provider from which to retrieve the key.
 * @param securityZone - The security zone for which to retrieve the key (default 0).
 * @returns {Promise<TfheCompactPublicKey>} - The retrieved public key.
 */
export const _store_fetchFheKey = async (
  chainId: string | undefined,
  securityZone: number = 0,
  send: SendFn | undefined,
): Promise<TfheCompactPublicKey> => {
  const storedKey = _store_getFheKey(chainId, securityZone);
  if (storedKey != null) return storedKey;

  const funcSig = "0x1b1b484e"; // cast sig "getNetworkPublicKey(int32)"
  const callData = funcSig + toABIEncodedUint32(securityZone);

  const callParams = [{ to: FheOpsAddress, data: callData }, "latest"];

  const publicKey = await send?.("eth_call", callParams).catch((err: Error) => {
    throw Error(
      `Error while requesting network public key from provider for security zone ${securityZone}: ${JSON.stringify(
        err,
      )}`,
    );
  });

  const chainIdNum: number = parseInt(chainId ?? "NaN", 16);
  if (isNaN(chainIdNum)) {
    throw new Error(
      `received non-hex number from chainId request: "${chainId}"`,
    );
  }

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
