"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultOk = exports.ResultErr = void 0;
const ResultErr = (error) => ({
    success: false,
    data: null,
    error,
});
exports.ResultErr = ResultErr;
const ResultOk = (data) => ({
    success: true,
    data,
    error: null,
});
exports.ResultOk = ResultOk;
//# sourceMappingURL=result.js.map