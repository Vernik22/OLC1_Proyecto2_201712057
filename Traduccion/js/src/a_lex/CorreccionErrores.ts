export class Correccion{
    cadenaFinal:String;
    pos_car:number[];

    constructor(){
        this.cadenaFinal="";
        this.pos_car=[];
    }

    eliminarC(cadena:String, posiciones:number[]):String{
       let recorrido = cadena;
        let posicionCar=0;
        if (posiciones.length!= 0){

            while (posicionCar < recorrido.length){
                let bandera=0;
                for(let index=0; index<posiciones.length;index++) {
                    
                    if (posiciones[index]==posicionCar){
                        bandera=1;
                        break;
                    }                
                      
                    else if(bandera==0){
                        bandera=1;
                        this.cadenaFinal+=recorrido[posicionCar];
                    }
                }
                
                posicionCar+=1
            }
               
           }       
        else{
            this.cadenaFinal=cadena;
        }
        return this.cadenaFinal; 
    }

    getCadenaFinal(){
        return this.cadenaFinal;
    }
}