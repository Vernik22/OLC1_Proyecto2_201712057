import {AnalizarJava} from "../Analisis";
import { Request, Response } from "express";


export let Tsplit=(req:Request, res: Response)=>{
    console.log("Entro una peticion REST");
    var te = req.body.Nombre.toString();
    let respuesta = AnalizarJava(te);

    res.send(JSON.stringify( {Saludo: "Bienvenidos a " + te} ));
    console.log(respuesta);
}