import { Token } from "../../a_lex/Token";
import { TypeToken } from "../../a_lex/Token";

export class Traduccion {

    controlToken: number;
    tockenActual: Token;
    tabulaciones: number;
    listaTokens: Token[];
    traduccion: String[];
    codigoTrad: String;

    constructor(listaTokens: Token[]) {
        this.controlToken = 0;
        this.tockenActual = new Token(TypeToken.NINGUNO, '');
        this.tabulaciones = 0;
        this.listaTokens = listaTokens;
        this.traduccion = [];
        this.agregarUltimo();
        this.codigoTrad = "";
    }
    Trad() {
        this.controlToken = 0;
        let ultimo = true;
        let main = false;
        let cermain = false;
        while (ultimo) {
            this.tockenActual = this.listaTokens[this.controlToken];
            if (this.tockenActual.token == TypeToken.CLASS || this.tockenActual.token == TypeToken.INTERFACE) {
                this.tockenActual = this.listaTokens[this.controlToken + 1];
                this.traduccion.push(this.tabs() + "class" + " " + this.tockenActual.lexema + ":");
                this.controlToken += 1;
                this.tabulaciones++;
            }
            else if (this.tockenActual.token == TypeToken.PUBLIC && this.listaTokens[this.controlToken + 1].token == TypeToken.STATIC && this.listaTokens[this.controlToken + 2].token == TypeToken.VOID) {
                //main
                this.traduccion.push(this.tabs() + "def" + " main():");
                this.controlToken += 9;
                this.tabulaciones++;
                main = true;

            } else if (main == true && cermain == true) {
                this.traduccion.push(this.tabs() + "if__name__=\"__main__\":");
                this.tabulaciones++;
                this.traduccion.push(this.tabs() + "main()");
                this.tabulaciones--;
                main = false;
                cermain = false;
            } else if (this.tockenActual.token == TypeToken.DIAGONAL) {
                if (this.listaTokens[this.controlToken + 1].token == TypeToken.DIAGONAL) {
                    this.traduccion.push(this.tabs() + "#" + this.listaTokens[this.controlToken + 2].lexema);
                    this.controlToken += 2;
                } else if (this.listaTokens[this.controlToken + 1].token == TypeToken.ASTERISCO) {
                    this.traduccion.push(this.tabs() + "'''" + this.listaTokens[this.controlToken + 2].lexema + "'''");
                    this.controlToken += 4;
                }

            } else if (this.tockenActual.token == TypeToken.WHILE) {
                let temp = "";
                for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                    if (this.listaTokens[index].token != TypeToken.PARENTESISDER) {
                        temp = temp + "" + this.listaTokens[index].lexema;
                    } else {

                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push(this.tabs() + "while " + temp + " :");
                this.tabulaciones++;
            } else if (this.tockenActual.token == TypeToken.DO) {

                this.traduccion.push(this.tabs() + "while True:" + temp + " :");
                this.tabulaciones++;
            } else if (this.tockenActual.token == TypeToken.IF) {
                if (this.listaTokens[this.controlToken - 1].token == TypeToken.ELSE ){

                    }
            }else if(this.tockenActual.token == TypeToken.ELSE){
                if (this.listaTokens[this.controlToken + 1].token == TypeToken.IF){

                }
            }
            /*else if(this.tockenActual.token == TypeToken.STRING || this.tockenActual.token == TypeToken.INT || this.tockenActual.token == TypeToken.CHAR || this.tockenActual.token == TypeToken.BOOLEAN || this.tockenActual.token == TypeToken.FLOAT || this.tockenActual.token == TypeToken.DOUBLE) {

            }*/
            else if (this.tockenActual.token == TypeToken.PUBLIC || this.tockenActual.token == TypeToken.PRIVATE || this.tockenActual.token == TypeToken.PROTECTED) {
                if (this.listaTokens[this.controlToken + 1].token == TypeToken.VOID || this.listaTokens[this.controlToken + 1].token == TypeToken.STRING || this.listaTokens[this.controlToken + 1].token == TypeToken.INT || this.listaTokens[this.controlToken + 1].token == TypeToken.CHAR || this.listaTokens[this.controlToken + 1].token == TypeToken.BOOLEAN || this.listaTokens[this.controlToken + 1].token == TypeToken.FLOAT || this.listaTokens[this.controlToken + 1].token == TypeToken.DOUBLE) {
                    let temp1 = "";
                    for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != TypeToken.PARENTESISDER) {
                            temp1 = temp1 + " " + this.listaTokens[index].lexema;
                        } else {
                            temp1 = temp1 + " " + this.listaTokens[index].lexema;
                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push(this.tabs() + "self" + " " + temp1 + ":");

                    this.tabulaciones++;

                }
            } else if (this.tockenActual.token == TypeToken.FOR) {
                //for(int f=0;f>5*4;f++)
                //for(f;f>5*4;f++)

                this.tockenActual = this.listaTokens[this.controlToken + 3];
                if (this.tockenActual.token == TypeToken.NUMERO || this.tockenActual.token == TypeToken.ID) {
                    let temp = this.tockenActual.lexema;
                    this.tockenActual = this.listaTokens[this.controlToken + 4];
                    if (this.tockenActual.token == TypeToken.ASIGNACION) {
                        this.tockenActual = this.listaTokens[this.controlToken + 5];
                        if (this.tockenActual.token == TypeToken.NUMERO || this.tockenActual.token == TypeToken.ID) {
                            let tempp = this.tockenActual.lexema; // guarda el numero de la declaracion del for (int f=9)


                            this.tockenActual = this.listaTokens[this.controlToken + 8];
                            if (this.tockenActual.token == TypeToken.ASIGNACION || this.tockenActual.token == TypeToken.ADMIRACION) {

                                this.tockenActual = this.listaTokens[this.controlToken + 10];
                                let temppp = this.tockenActual.lexema;
                                for (let index = this.controlToken + 11; index < this.listaTokens.length; index++) {
                                    if (this.listaTokens[index].token != TypeToken.PCOMA) {
                                        temppp = temppp + "" + this.listaTokens[index].lexema;
                                    } else {

                                        this.controlToken = index + 4;
                                        break;
                                    }

                                }
                                this.traduccion.push(this.tabs() + "for " + temp + " in range(" + tempp + "," + temppp + "):");
                                this.tabulaciones++;
                            }


                            else if (this.tockenActual.token == TypeToken.MAYORQ || this.tockenActual.token == TypeToken.MENORQ) {

                                this.tockenActual = this.listaTokens[this.controlToken + 9];
                                if (this.tockenActual.token == TypeToken.ASIGNACION) {
                                    this.tockenActual = this.listaTokens[this.controlToken + 10];
                                    let temppp = this.tockenActual.lexema;
                                    for (let index = this.controlToken + 11; index < this.listaTokens.length; index++) {
                                        if (this.listaTokens[index].token != TypeToken.PCOMA) {
                                            temppp = temppp + "" + this.listaTokens[index].lexema;
                                        } else {

                                            this.controlToken = index + 4;
                                            break;
                                        }

                                    }
                                    this.traduccion.push(this.tabs() + "for " + temp + " in range(" + tempp + "," + temppp + "):");
                                    this.tabulaciones++;
                                }
                                else {
                                    this.tockenActual = this.listaTokens[this.controlToken + 9];
                                    let temppp = this.tockenActual.lexema;
                                    for (let index = this.controlToken + 10; index < this.listaTokens.length; index++) {
                                        if (this.listaTokens[index].token != TypeToken.PCOMA) {
                                            temppp = temppp + "" + this.listaTokens[index].lexema;
                                        } else {

                                            this.controlToken = index + 4;
                                            break;
                                        }

                                    }
                                    this.traduccion.push(this.tabs() + "for " + temp + " in range(" + tempp + "," + temppp + "):");
                                    this.tabulaciones++;
                                }
                            }


                        }

                    }
                }
                /*
                
                                //for(int f=0;f>5*4;f++)
                                //for(f;f>5*4;f++)
                                if (this.listaTokens[this.controlToken + 2].token == TypeToken.ID) {
                                    let temp = this.listaTokens[this.controlToken + 2].lexema;
                                    if (condition) {
                                        this.traduccion.push(this.tabs() + "for" + this.tockenActual.lexema + " in range(" + temp + "," + temp1 + "):");
                                        this.tabulaciones++;
                                    } else {
                                        this.traduccion.push(this.tabs() + "for" + this.tockenActual.lexema + " in range(" + temp + "," + temp1 + "):");
                                        this.tabulaciones++;
                                    }
                
                                } else
                                    if (this.listaTokens[this.controlToken + 2].token == TypeToken.STRING || this.listaTokens[this.controlToken + 2].token == TypeToken.INT || this.listaTokens[this.controlToken + 2].token == TypeToken.CHAR || this.listaTokens[this.controlToken + 2].token == TypeToken.BOOLEAN || this.listaTokens[this.controlToken + 2].token == TypeToken.FLOAT || this.listaTokens[this.controlToken + 2].token == TypeToken.DOUBLE) {
                                        let temp = this.listaTokens[this.controlToken + 3].lexema;
                                        let temp1 = this.listaTokens[this.controlToken + 5].lexema;
                                        if (condition) {
                
                                        }
                                        this.traduccion.push(this.tabs() + "for" + temp + "in range(" + temp1 + "," + temp2 + "):");
                                        this.tabulaciones++;
                                    }
                */

            }
            else if (this.tockenActual.token == TypeToken.ID) {
                let temp = this.tockenActual.lexema;
                this.tockenActual = this.listaTokens[this.controlToken + 1];
                if (this.tockenActual.token == TypeToken.ASIGNACION) {
                    this.tockenActual = this.listaTokens[this.controlToken + 2];
                    if (this.tockenActual.token == TypeToken.NUMERO) {
                        let num = this.tockenActual.lexema;
                        this.tockenActual = this.listaTokens[this.controlToken + 3];
                        if (this.tockenActual.token == TypeToken.PUNTO) {
                            this.tockenActual = this.listaTokens[this.controlToken + 4];

                            this.traduccion.push(this.tabs() + "" + temp + "=" + num + "." + this.tockenActual.lexema);



                            this.controlToken += 3;
                        }
                        else {
                            //Guardar asignacion en traduccion

                            this.traduccion.push(this.tabs() + "" + temp + "=" + num);
                            this.controlToken += 2;
                        }

                    } else if (this.tockenActual.token == TypeToken.COMILLASIMPLE || this.tockenActual.token == TypeToken.COMILLAS) {
                        this.tockenActual = this.listaTokens[this.controlToken + 2];

                        let tempp = this.tockenActual.lexema;

                        this.tockenActual = this.listaTokens[this.controlToken + 3];
                        //Guardar asignacion en traduccion

                        this.traduccion.push(this.tabs() + "" + temp + "=" + tempp + this.tockenActual.lexema + tempp);

                    }
                    else {
                        this.controlToken += 2;
                        let dentro = "";
                        for (let i = this.controlToken; i < this.listaTokens.length; i++) {
                            this.tockenActual = this.listaTokens[i];

                            if (this.tockenActual.token == TypeToken.PCOMA) {

                                //traduccion[f] = tabs() + "print(" + dentro + ")";
                                this.traduccion.push(this.tabs() + "" + temp + "=" + dentro);

                                break;
                            }
                            dentro = dentro + this.tockenActual.lexema;
                            this.controlToken = i;
                        }

                    }
                }

            }
            else if (this.tockenActual.token == TypeToken.LLAVEDER) {

                if (this.tabulaciones > 0) {
                    this.tabulaciones--;
                }
                if (main) {
                    cermain = true;
                }
            }

            this.controlToken++;

            if (this.tockenActual.token == TypeToken.NINGUNO) {
                ultimo = false;
            }
        }
        this.crearTraduccion();
    }


    //---------------------------------------------- -
    crearTraduccion() {
        for (let i = 0; i < this.traduccion.length; i++) {
            if (this.traduccion[i] != null) {

                this.codigoTrad = this.codigoTrad + "" + this.traduccion[i] + "\n";

            }

        }
    }
    getCodigoTrad(): String {
        return this.codigoTrad;
    }
    tabs(): String {
        let tabss = "";
        for (let i = 0; i < this.tabulaciones; i++) {
            tabss = tabss + "\t";
        }


        return tabss;
    }
    agregarUltimo() {
        this.listaTokens.push(new Token(TypeToken.NINGUNO, ''));
    }
}