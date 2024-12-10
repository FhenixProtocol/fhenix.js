import { TfheClientKey, TfheCompactPublicKey } from "./fhe/tfhe";
export declare const createTfheKeypair: () => {
    clientKey: TfheClientKey;
    publicKey: TfheCompactPublicKey;
};
export declare const createTfhePublicKey: () => string;
export declare const toHexString: (bytes: Uint8Array) => string;
//# sourceMappingURL=keygen.d.ts.map