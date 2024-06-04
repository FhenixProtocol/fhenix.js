import { SupportedProvider } from "./types";
import { TfheCompactPublicKey } from "./fhe/fhe.js";
export declare const GetFhePublicKey: (getKeyFn: (provider: SupportedProvider) => Promise<TfheCompactPublicKey>, provider: SupportedProvider) => Promise<TfheCompactPublicKey>;
