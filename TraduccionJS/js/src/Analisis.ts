import { Request, Response } from "express";
var parser = require('./a_lex/estructura.js');

//let lerror:Error[];
//let ltok:Token[];
let ltok:string;
let lersint:String[];
let traduc:String;
let grafo:String;
export function AnalizarJava(entrada:string):String{
ltok=parser.parse(entrada);
console.log('-------------jison')
console.log(ltok);
return "exito";
}

export let TradJs=(req:Request, res: Response)=>{
    /*
    res.send(JSON.stringify( {Errores: lerror,
                              Tokens: ltok,
                            ErroresSin:lersint,
                            Traduccion:traduc,
                            Grafo:grafo } ));
                            */
    
}


export let Ltokens=(req:Request, res: Response)=>{
    
    //res.send(JSON.stringify( {Tokens: ltok} ));
    
}
export let Lesint=(req:Request, res: Response)=>{
    
    res.send(JSON.stringify( {Errores: lersint} ));
    
}
export let Ctraduc=(req:Request, res: Response)=>{
    
    res.send(JSON.stringify( {Traduccion: traduc} ));
    
}