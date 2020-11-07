"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manejo = __importStar(require("./manejoText"));
const error = __importStar(require("../Analisis"));
const router = express_1.Router();
router.get('/tradPy', error.TradPy);
router.get('/Tokens', error.Ltokens);
router.get('/Esin', error.Lesint);
router.get('/Ctraducido', error.Ctraduc);
router.post('/b', (req, res) => {
    res.send('Vernik GOD');
});
router.post('/recibir', manejo.Tsplit);
exports.default = router;
