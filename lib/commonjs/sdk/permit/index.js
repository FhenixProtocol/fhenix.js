"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignatureDomain = exports.getSignatureTypesAndMessage = exports.SignatureTypes = exports.PermitV2 = exports.permitStore = void 0;
var store_1 = require("./store");
Object.defineProperty(exports, "permitStore", { enumerable: true, get: function () { return store_1.permitStore; } });
var permit_1 = require("./permit");
Object.defineProperty(exports, "PermitV2", { enumerable: true, get: function () { return permit_1.PermitV2; } });
var generate_1 = require("./generate");
Object.defineProperty(exports, "SignatureTypes", { enumerable: true, get: function () { return generate_1.SignatureTypes; } });
Object.defineProperty(exports, "getSignatureTypesAndMessage", { enumerable: true, get: function () { return generate_1.getSignatureTypesAndMessage; } });
Object.defineProperty(exports, "getSignatureDomain", { enumerable: true, get: function () { return generate_1.getSignatureDomain; } });
//# sourceMappingURL=index.js.map