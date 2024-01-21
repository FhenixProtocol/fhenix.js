"use strict";
// for mobile
// if (typeof BigInt === "undefined") {
//   global.BigInt = require("big-integer");
// }
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSealingKey = exports.SealingKey = exports.EncryptionTypes = exports.FhenixClient = void 0;
var index_1 = require("./sdk/index");
Object.defineProperty(exports, "FhenixClient", { enumerable: true, get: function () { return index_1.FhenixClient; } });
var types_1 = require("./sdk/types");
Object.defineProperty(exports, "EncryptionTypes", { enumerable: true, get: function () { return types_1.EncryptionTypes; } });
__exportStar(require("./extensions/access_control"), exports);
var sealing_1 = require("./sdk/sealing");
Object.defineProperty(exports, "SealingKey", { enumerable: true, get: function () { return sealing_1.SealingKey; } });
Object.defineProperty(exports, "GenerateSealingKey", { enumerable: true, get: function () { return sealing_1.GenerateSealingKey; } });
//# sourceMappingURL=index.js.map