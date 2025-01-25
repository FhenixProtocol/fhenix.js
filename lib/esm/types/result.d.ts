export type Result<T, E = string> = {
    success: true;
    data: T;
    error: null;
} | {
    success: false;
    data: null;
    error: E;
};
export declare const ResultErr: <T, E>(error: E) => Result<T, E>;
export declare const ResultOk: <T, E>(data: T) => Result<T, E>;
//# sourceMappingURL=result.d.ts.map