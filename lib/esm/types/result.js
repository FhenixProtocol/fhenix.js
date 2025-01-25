export const ResultErr = (error) => ({
    success: false,
    data: null,
    error,
});
export const ResultOk = (data) => ({
    success: true,
    data,
    error: null,
});
//# sourceMappingURL=result.js.map