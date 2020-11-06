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
                if(this.listaTokens[this.controlToken+1].token == TypeToken.PCOMA){
                    this.tabulaciones++;
                    this.traduccion.push(this.tabs() + "if " + temp + " :");
                    this.tabulaciones++;
                    this.traduccion.push(this.tabs() + "break");
                    this.tabulaciones-=2;
                }else{
                    this.traduccion.push(this.tabs() + "while " + temp + " :");
                    this.tabulaciones++;
                }
                
            } else if (this.tockenActual.token == TypeToken.DO) {
                this.traduccion.push(this.tabs() + "while True:");
                this.tabulaciones++;
            } else if (this.tockenActual.token == TypeToken.IF) {
                if (this.listaTokens[this.controlToken - 1].token == TypeToken.ELSE) {
                    let temp = "";
                    for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != TypeToken.PARENTESISDER) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push(this.tabs() + "elif " + temp + " :");
                    this.tabulaciones++;
                } else {
                    let temp = "";
                    for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != TypeToken.PARENTESISDER) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push(this.tabs() + "if " + temp + " :");
                    this.tabulaciones++;
                }
            } else if (this.tockenActual.token == TypeToken.ELSE) {
                if (this.listaTokens[this.controlToken + 1].token == TypeToken.IF) {

                } else {
                    this.traduccion.push(this.tabs() + "else :");
                    this.tabulaciones++;
                }
            } else if (this.tockenActual.token == TypeToken.BREAK) {
                this.traduccion.push(this.tabs() + "break");
            } else if (this.tockenActual.token == TypeToken.CONTINUE) {
                this.traduccion.push(this.tabs() + "continue");
            } else if (this.tockenActual.token == TypeToken.RETURN) {
                let temp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    if (this.listaTokens[index].token != TypeToken.PCOMA) {
                        temp = temp + "" + this.listaTokens[index].lexema;
                    } else {

                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push(this.tabs() + "return " + temp);
            } else if (this.tockenActual.token == TypeToken.SYSTEM && this.listaTokens[this.controlToken + 1].token == TypeToken.PUNTO && this.listaTokens[this.controlToken + 2].token == TypeToken.OUT) {
                if (this.listaTokens[this.controlToken + 4].token == TypeToken.PRINTLN) {
                    let temp = "";
                    for (let index = this.controlToken + 6; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != TypeToken.PCOMA) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push(this.tabs() + "print(" + temp + ";");
                } else {
                    let temp = "";
                    for (let index = this.controlToken + 6; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != TypeToken.PARENTESISDER && this.listaTokens[index + 1].token != TypeToken.PCOMA) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push(this.tabs() + "print(" + temp + ",end=\"\"" + ");");
                }
            }
            else if (this.tockenActual.token == TypeToken.STRING || this.tockenActual.token == TypeToken.INT || this.tockenActual.token == TypeToken.CHAR || this.tockenActual.token == TypeToken.BOOLEAN || this.tockenActual.token == TypeToken.FLOAT || this.tockenActual.token == TypeToken.DOUBLE) {
                let temp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    if (this.listaTokens[index + 1].token != TypeToken.PCOMA) {
                        temp = temp + "" + this.listaTokens[index].lexema;
                    } else {

                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push(this.tabs() + "var " + temp);
            }
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

            }
            else if (this.tockenActual.token == TypeToken.ID) {
                let temp = this.tockenActual.lexema;
                let temppp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    if (this.listaTokens[index].token != TypeToken.PCOMA) {
                        temppp = temppp + "" + this.listaTokens[index].lexema;
                    } else {

                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push(this.tabs() + "" + temp + temppp);

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