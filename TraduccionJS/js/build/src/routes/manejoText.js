"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tsplit = void 0;
const Analisis_1 = require("../Analisis");
exports.Tsplit = (req, res) => {
    console.log("Entro una peticion REST");
    var te = req.body.Nombre.toString();
    let respuesta = Analisis_1.AnalizarJava(te);
    res.send(JSON.stringify({ Saludo: "Bienvenidos a " + te }));
    console.log(respuesta);
};
