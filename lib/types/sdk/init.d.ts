import { SupportedProvider } from "./types.js";
import { TfheCompactPublicKey } from "./fhe/fhe.js";
export declare const GetFhePublicKey: (getKeyFn: (provider: SupportedProvider) => Promise<TfheCompactPublicKey>, provider: SupportedProvider) => Promise<TfheCompactPublicKey>;
//# sourceMappingURL=init.d.ts.map