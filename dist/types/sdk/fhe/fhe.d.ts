import { TfheCompactPublicKey, TfheClientKey } from "node-tfhe";
export declare const createTfheKeypair: () => {
    clientKey: TfheClientKey;
    publicKey: TfheCompactPublicKey;
};
export declare const createTfhePublicKey: () => string;
export declare const asyncInitFhevm: () => Promise<void>;
export { TfheCompactPublicKey } from "node-tfhe";
export { CompactFheBoolList, CompactFheUint8List, CompactFheUint16List, CompactFheUint32List, CompactFheUint64List, CompactFheUint128, CompactFheUint160, CompactFheUint256, } from "node-tfhe";
//# sourceMappingURL=fhe.d.ts.map