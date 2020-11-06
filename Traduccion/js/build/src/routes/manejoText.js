"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tsplit = void 0;
const Analisis_1 = require("../Analisis");
/*
export let Tsplit = (req:Request, res: Response) =>{
    console.log("Entro una peticion REST");
    var te = req.body.Nombre.toString().split("$$");
    var temp="";
    for (var i = 0; i < te.length; i++) {
        if(i==te.length-1){
            temp= temp+te[i];
          }else{
            temp=temp+te[i]+"\n";
          }
       }
    var tempT="";
       for (let index = 0; index < temp.length; index++) {
        let car=temp[index];
        if (car=='¡') {
            tempT=tempT+"\"";
        }else{
            tempT=tempT+car;
        }
        
    }
    let respuesta = AnalizarJava(tempT);
    //res.send(JSON.stringify( {Saludo: "Bienvenidos a " + req.body.Nombre.toString()} ));
    res.send(JSON.stringify( {Saludo: "Bienvenidos a " + temp} ));
    console.log(respuesta);
}*/
exports.Tsplit = (req, res) => {
    console.log("Entro una peticion REST");
    var te = req.body.Nombre.toString();
    let respuesta = Analisis_1.AnalizarJava(te);
    res.send(JSON.stringify({ Saludo: "Bienvenidos a " + te }));
    console.log(respuesta);
};
