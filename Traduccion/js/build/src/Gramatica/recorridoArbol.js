"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecorridoA = void 0;
class RecorridoA {
    constructor() {
        this.id_n = 1;
        this.concatenar = "";
    }
    getConcatenar() {
        return this.concatenar;
    }
    recorrerArbol(nodo) {
        if (nodo.id == 0) {
            nodo.id = this.id_n;
            this.id_n++;
        }
        //id[label= valor fillcolor="#d62728" shape="circle"];
        this.concatenar += nodo.id + '[label="' + nodo.valor + '" fillcolor="#d62728" shape="circle"]; ';
        // console.log( nodo.id + '[label="' + nodo.valor + '" fillcolor="#d62728" shape="circle"];');
        nodo.hijos.forEach(element => {
            //id -> id
            this.concatenar += nodo.id + '->' + this.id_n + ' ; ';
            //   console.log( nodo.id+'->'+this.id_n+' ; ')
            this.recorrerArbol(element);
        });
    }
}
exports.RecorridoA = RecorridoA;
