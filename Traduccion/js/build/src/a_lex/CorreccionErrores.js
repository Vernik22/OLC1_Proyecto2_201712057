"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Correccion = void 0;
class Correccion {
    constructor() {
        this.cadenaFinal = "";
        this.pos_car = [];
    }
    eliminarC(cadena, posiciones) {
        let recorrido = cadena;
        let posicionCar = 0;
        if (posiciones.length != 0) {
            while (posicionCar < recorrido.length) {
                for (let index = 0; index < posiciones.length; index++) {
                    if (posiciones[index] == posicionCar) {
                        break;
                    }
                    else {
                        this.cadenaFinal += recorrido[posicionCar];
                    }
                }
                posicionCar += 1;
            }
        }
        else {
            this.cadenaFinal = cadena;
        }
    }
    getCadenaFinal() {
        return this.cadenaFinal;
    }
}
exports.Correccion = Correccion;
