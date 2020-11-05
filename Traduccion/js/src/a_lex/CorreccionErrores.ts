export class Correccion{
    cadenaFinal:String;
    pos_car:number[];

    constructor(){
        this.cadenaFinal="";
        this.pos_car=[];
    }

    eliminarC(cadena:String, posiciones:number[]){
       let recorrido = cadena;
        let posicionCar=0;
        if (posiciones.length!= 0){

            while (posicionCar < recorrido.length){
                for(let index=0; index<posiciones.length;index++) {
                    
                    if (posiciones[index]==posicionCar){
                        break;
                    }                
                      
                    else{
                        this.cadenaFinal+=recorrido[posicionCar];
                    }
                }
                
                posicionCar+=1
            }
               
           }       
        else{
            this.cadenaFinal=cadena;
        }
            
    }

    getCadenaFinal(){
        return this.cadenaFinal;
    }
}