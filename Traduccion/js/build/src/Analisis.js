"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalizarJava = void 0;
const Scanner_1 = require("./a_lex/Scanner");
const ParserPython_1 = require("./a_sint/SinJison/ParserPython");
const CorreccionErrores_1 = require("./a_lex/CorreccionErrores");
const Traduccion_1 = require("./a_sint/SinJison/Traduccion");
function AnalizarJava(entrada) {
    console.log('---------------------------Lexico*---------');
    const aLex = new Scanner_1.Scanner();
    let listaTokens = aLex.Analizar(entrada);
    let posiErrores = aLex.getErrores();
    if (posiErrores.length > 0) {
        const corr = new CorreccionErrores_1.Correccion();
        corr.eliminarC(entrada, posiErrores);
        let entradaN = corr.getCadenaFinal();
        listaTokens = aLex.Analizar(entradaN);
    }
    console.log(listaTokens);
    console.log('----------------------------Sintactico*-------');
    const aSint = new ParserPython_1.Parser(listaTokens);
    aSint.Analizar();
    let errores = aSint.getListaErrores();
    console.log(errores);
    console.log('--------------------------Fin*---------');
    if (errores.length == 0) {
        const trad = new Traduccion_1.Traduccion(listaTokens);
        trad.Trad();
        let codigo = trad.getCodigoTrad();
        console.log('-------------------CODIGO TRAD*-------------------');
        console.log(codigo);
    }
    return "exito";
}
exports.AnalizarJava = AnalizarJava;
