"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctraduc = exports.Lesint = exports.Ltokens = exports.TradJs = exports.AnalizarJava = void 0;
//let lerror:Error[];
//let ltok:Token[];
let lersint;
let traduc;
let grafo;
function AnalizarJava(entrada) {
    return "exito";
}
exports.AnalizarJava = AnalizarJava;
exports.TradJs = (req, res) => {
    /*
    res.send(JSON.stringify( {Errores: lerror,
                              Tokens: ltok,
                            ErroresSin:lersint,
                            Traduccion:traduc,
                            Grafo:grafo } ));
                            */
};
exports.Ltokens = (req, res) => {
    //res.send(JSON.stringify( {Tokens: ltok} ));
};
exports.Lesint = (req, res) => {
    res.send(JSON.stringify({ Errores: lersint }));
};
exports.Ctraduc = (req, res) => {
    res.send(JSON.stringify({ Traduccion: traduc }));
};
