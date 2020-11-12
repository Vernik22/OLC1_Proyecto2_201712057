import { Request, Response } from "express";
var parser = require('./a_lex/estructura.js');
import { RecorridoA } from "./Gramatica/recorridoArbol";
import {Traduccion} from "./a_sint/ConJison/Traduccion";

let lerror: string[];
let ltok: string[];
let lersint: string[];
let traduc: string;
let grafo: String;
export function AnalizarJava(entrada: string): String {
    var p = parser.parse(entrada);
    console.log('-------------jison')
    console.log(p.tabla_Tokens);
    console.log(p.tabla_Errores)
    ltok = p.tabla_Tokens;
    lerror = p.tabla_Errores;
    let recorrido=p.ast;
    
    const tr=new Traduccion(ltok); 
    tr.Trad();
    traduc=tr.getCodigoTrad();

    
    return "exito";
}

export let TradJs = (req: Request, res: Response) => {

    res.send(JSON.stringify({
        Errores: lerror,
        Tokens: ltok,
        ErroresSin: lersint,
        Traduccion: traduc,
        Grafo: grafo
    }));


}


export let Ltokens = (req: Request, res: Response) => {

    //res.send(JSON.stringify( {Tokens: ltok} ));

}
export let Lesint = (req: Request, res: Response) => {

    res.send(JSON.stringify({ Errores: lersint }));

}
export let Ctraduc = (req: Request, res: Response) => {

    res.send(JSON.stringify({ Traduccion: traduc }));

}