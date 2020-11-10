import {AnalizarJava} from "../Analisis";
import { Request, Response } from "express";


export let Tsplit=(req:Request, res: Response)=>{
    console.log("Entro una peticion REST");
    var te = req.body.Nombre;
    let to=te.replace(/\"/gi,"\'");
    console.log(to);
    let respuesta = AnalizarJava(to);

    res.send(JSON.stringify( {Saludo: "Bienvenidos a " + te} ));
    console.log(respuesta);
}