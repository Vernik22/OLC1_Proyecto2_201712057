export class Nodo_Arbol{
    id:number;
    valor:string;
    tipo:string;
    hijos:Nodo_Arbol[];
    constructor(valor:string,tipo:string){
        this.id=0;
        this.valor=valor;
        this.tipo=tipo;
        this.hijos=[];
    }

    getValor():String{
        return this.valor;
    }
    getTipo():String{
        return this.tipo;
    }
    agregarHijo(hijo:Nodo_Arbol){
        this.hijos.push(hijo);
    }
}