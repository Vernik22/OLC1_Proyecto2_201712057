"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctraduc = exports.Lesint = exports.Ltokens = exports.TradJs = exports.AnalizarJava = void 0;
var parser = require('./a_lex/estructura.js');
const Traduccion_1 = require("./a_sint/ConJison/Traduccion");
let lerror;
let ltok;
let lersint;
let traduc;
let grafo;
function AnalizarJava(entrada) {
    var p = parser.parse(entrada);
    console.log('-------------jison');
    console.log(p.tabla_Tokens);
    console.log(p.tabla_Errores);
    ltok = p.tabla_Tokens;
    lerror = p.tabla_Errores;
    let recorrido = p.ast;
    const tr = new Traduccion_1.Traduccion(ltok);
    tr.Trad();
    traduc = tr.getCodigoTrad();
    return "exito";
}
exports.AnalizarJava = AnalizarJava;
exports.TradJs = (req, res) => {
    res.send(JSON.stringify({
        Errores: lerror,
        Tokens: ltok,
        ErroresSin: lersint,
        Traduccion: traduc,
        Grafo: grafo
    }));
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
