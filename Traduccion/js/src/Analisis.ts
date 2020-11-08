import {Scanner} from "./a_lex/Scanner";
import {Parser} from "./a_sint/SinJison/ParserPython";
import {Correccion} from "./a_lex/CorreccionErrores";
import {Traduccion} from "./a_sint/SinJison/Traduccion"
import { Token } from "./a_lex/Token";
import {Error} from "./a_lex/Token";
import { Request, Response } from "express";
import { Nodo_Arbol } from "./Gramatica/nodoArbol";
import { RecorridoA } from "./Gramatica/recorridoArbol";

let lerror:Error[];
let ltok:Token[];
let lersint:String[];
let traduc:String;
let grafo:String;

export function AnalizarJava(entrada:string):String{
console.log('---------------------------Lexico*---------')
const aLex  = new Scanner();
let listaTokens = aLex.Analizar(entrada);
let posiErrores= aLex.getErrores();
lerror=aLex.getLerrores();
if (posiErrores.length>0) {
    const aLex1  = new Scanner();
    const corr = new Correccion();
    let entradaN = corr.eliminarC(entrada,posiErrores);
    listaTokens=[];
    listaTokens = aLex1.Analizar(entradaN);
}
ltok=listaTokens;
console.log(listaTokens);
console.log('----------------------------Sintactico*-------')

const aSint = new Parser(listaTokens);
aSint.Analizar();
let errores = aSint.getListaErrores();
lersint=errores;
console.log(errores);
let recorrido=aSint.getRecorrido();
const rec = new RecorridoA()
rec.recorrerArbol(recorrido);
grafo=rec.getConcatenar();

console.log('--------------------------Fin*---------')
if(errores.length==0){
    const trad = new Traduccion(listaTokens);
    trad.Trad();
    let codigo = trad.getCodigoTrad();
    traduc=codigo;

    console.log('-------------------CODIGO TRAD*-------------------');
    console.log(codigo);
}

    return "exito"; 
}

export let TradPy=(req:Request, res: Response)=>{
    
    res.send(JSON.stringify( {Errores: lerror,
                              Tokens: ltok,
                            ErroresSin:lersint,
                            Traduccion:traduc,
                            Grafo:grafo } ));
    
}
export let Ltokens=(req:Request, res: Response)=>{
    
    res.send(JSON.stringify( {Tokens: ltok} ));
    
}
export let Lesint=(req:Request, res: Response)=>{
    
    res.send(JSON.stringify( {Errores: lersint} ));
    
}
export let Ctraduc=(req:Request, res: Response)=>{
    
    res.send(JSON.stringify( {Traduccion: traduc} ));
    
}