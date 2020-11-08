"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo_Arbol = void 0;
class Nodo_Arbol {
    constructor(valor, tipo) {
        this.id = 0;
        this.valor = valor;
        this.tipo = tipo;
        this.hijos = [];
    }
    getValor() {
        return this.valor;
    }
    getTipo() {
        return this.tipo;
    }
    agregarHijo(hijo) {
        this.hijos.push(hijo);
    }
}
exports.Nodo_Arbol = Nodo_Arbol;
