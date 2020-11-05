import {Scanner} from "./a_lex/Scanner";
import {Parser} from "./a_sint/SinJison/ParserPython";
import {Correccion} from "./a_lex/CorreccionErrores";
import {Traduccion} from "./a_sint/SinJison/Traduccion"

export function AnalizarJava(entrada:string):String{
console.log('---------------------------Lexico*---------')
const aLex  = new Scanner();
let listaTokens = aLex.Analizar(entrada);
let posiErrores= aLex.getErrores();
if (posiErrores.length>0) {
    const corr = new Correccion();
    corr.eliminarC(entrada,posiErrores);
    let entradaN = corr.getCadenaFinal();
    listaTokens = aLex.Analizar(entradaN);
}
console.log(listaTokens);
console.log('----------------------------Sintactico*-------')

const aSint = new Parser(listaTokens);
aSint.Analizar();
let errores = aSint.getListaErrores();
console.log(errores);

console.log('--------------------------Fin*---------')
if(errores.length==0){
    const trad = new Traduccion(listaTokens);
    trad.Trad();
    let codigo = trad.getCodigoTrad();
    console.log('-------------------CODIGO TRAD*-------------------');
    console.log(codigo);
}

    return "exito";
}