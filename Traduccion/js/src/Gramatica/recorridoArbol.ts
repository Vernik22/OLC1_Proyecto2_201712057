import { Nodo_Arbol } from "./nodoArbol";


export class RecorridoA {
    id_n: number;
    concatenar:String;
    constructor() {
        this.id_n = 1;
        this.concatenar="";
    }
    getConcatenar():String{
        return this.concatenar;
    }

    recorrerArbol(nodo: Nodo_Arbol) {
        if (nodo.id == 0) {
            nodo.id = this.id_n;
            this.id_n++;
        }
        //id[label= valor fillcolor="#d62728" shape="circle"];
        this.concatenar += nodo.id + '[label="' + nodo.valor + '" fillcolor="#d62728" shape="circle"]; '
       // console.log( nodo.id + '[label="' + nodo.valor + '" fillcolor="#d62728" shape="circle"];');
     
        nodo.hijos.forEach(element => {
            //id -> id
            this.concatenar+= nodo.id+'->'+this.id_n+' ; ';
         //   console.log( nodo.id+'->'+this.id_n+' ; ')
            this.recorrerArbol(element);
        });

    }

}