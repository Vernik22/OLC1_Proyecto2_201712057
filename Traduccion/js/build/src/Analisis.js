"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctraduc = exports.Lesint = exports.Ltokens = exports.TradPy = exports.AnalizarJava = void 0;
const Scanner_1 = require("./a_lex/Scanner");
const ParserPython_1 = require("./a_sint/SinJison/ParserPython");
const CorreccionErrores_1 = require("./a_lex/CorreccionErrores");
const Traduccion_1 = require("./a_sint/SinJison/Traduccion");
let lerror;
let ltok;
let lersint;
let traduc;
function AnalizarJava(entrada) {
    console.log('---------------------------Lexico*---------');
    const aLex = new Scanner_1.Scanner();
    let listaTokens = aLex.Analizar(entrada);
    let posiErrores = aLex.getErrores();
    lerror = aLex.getLerrores();
    if (posiErrores.length > 0) {
        const aLex1 = new Scanner_1.Scanner();
        const corr = new CorreccionErrores_1.Correccion();
        let entradaN = corr.eliminarC(entrada, posiErrores);
        listaTokens = [];
        listaTokens = aLex1.Analizar(entradaN);
    }
    ltok = listaTokens;
    console.log(listaTokens);
    console.log('----------------------------Sintactico*-------');
    const aSint = new ParserPython_1.Parser(listaTokens);
    aSint.Analizar();
    let errores = aSint.getListaErrores();
    lersint = errores;
    console.log(errores);
    console.log('--------------------------Fin*---------');
    if (errores.length == 0) {
        const trad = new Traduccion_1.Traduccion(listaTokens);
        trad.Trad();
        let codigo = trad.getCodigoTrad();
        traduc = codigo;
        console.log('-------------------CODIGO TRAD*-------------------');
        console.log(codigo);
    }
    return "exito";
}
exports.AnalizarJava = AnalizarJava;
exports.TradPy = (req, res) => {
    res.send(JSON.stringify({ Errores: lerror,
        Tokens: ltok,
        ErroresSin: lersint,
        Traduccion: traduc }));
};
exports.Ltokens = (req, res) => {
    res.send(JSON.stringify({ Tokens: ltok }));
};
exports.Lesint = (req, res) => {
    res.send(JSON.stringify({ Errores: lersint }));
};
exports.Ctraduc = (req, res) => {
    res.send(JSON.stringify({ Traduccion: traduc }));
};
