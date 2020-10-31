import {AnalizarJava} from "../Analisis";
import { Request, Response } from "express";

export let Tsplit = (req:Request, res: Response) =>{
    console.log("Entro una peticion REST Ejemplo 9");
    var te = req.body.Nombre.toString().split("$$");
    var temp="";
    for (var i = 0; i < te.length; i++) {
        if(i==te.length-1){
            temp= temp+te[i];
          }else{
            temp=temp+te[i]+"\n";
          }
       }
    let respuesta = AnalizarJava(temp);
    //res.send(JSON.stringify( {Saludo: "Bienvenidos a " + req.body.Nombre.toString()} ));
    res.send(JSON.stringify( {Saludo: "Bienvenidos a " + temp} ));
    console.log(respuesta);
}