import {Scanner} from "./a_lex/Scanner";
import {Parser} from "./a_sint/SinJison/ParserPython";

export function AnalizarJava(entrada:string):String{
console.log('---------------------------Lexico*---------')
const aLex  = new Scanner();
let listaTokens = aLex.Analizar(entrada);
console.log(listaTokens);
console.log('----------------------------Sintactico*-------')


console.log('--------------------------Fin*---------')

    return "exito";
}