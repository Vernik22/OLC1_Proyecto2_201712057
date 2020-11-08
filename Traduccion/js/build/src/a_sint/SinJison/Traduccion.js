"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Traduccion = void 0;
const Token_1 = require("../../a_lex/Token");
const Token_2 = require("../../a_lex/Token");
class Traduccion {
    constructor(listaTokens) {
        this.controlToken = 0;
        this.tockenActual = new Token_1.Token(Token_2.TypeToken.NINGUNO, '');
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
            if (this.tockenActual.token == Token_2.TypeToken.CLASS || this.tockenActual.token == Token_2.TypeToken.INTERFACE) {
                this.tockenActual = this.listaTokens[this.controlToken + 1];
                this.traduccion.push(this.tabs() + "class" + " " + this.tockenActual.lexema + ":");
                this.controlToken += 1;
                this.tabulaciones++;
            }
            else if (this.tockenActual.token == Token_2.TypeToken.PUBLIC && this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.STATIC && this.listaTokens[this.controlToken + 2].token == Token_2.TypeToken.VOID) {
                //main
                this.traduccion.push(this.tabs() + "def" + " main():");
                this.controlToken += 9;
                this.tabulaciones++;
                main = true;
            }
            else if (main == true && cermain == true) {
                this.traduccion.push(this.tabs() + "if__name__=\"__main__\":");
                this.tabulaciones++;
                this.traduccion.push(this.tabs() + "main()");
                this.tabulaciones--;
                main = false;
                cermain = false;
            }
            else if (this.tockenActual.token == Token_2.TypeToken.DIAGONAL) {
                if (this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.DIAGONAL) {
                    this.traduccion.push(this.tabs() + "#" + this.listaTokens[this.controlToken + 2].lexema);
                    this.controlToken += 2;
                }
                else if (this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.ASTERISCO) {
                    this.traduccion.push(this.tabs() + "'''" + this.listaTokens[this.controlToken + 2].lexema + "'''");
                    this.controlToken += 4;
                }
            }
            else if (this.tockenActual.token == Token_2.TypeToken.WHILE) {
                let temp = "";
                for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                    if (this.listaTokens[index].token != Token_2.TypeToken.PARENTESISDER) {
                        temp = temp + "" + this.listaTokens[index].lexema;
                    }
                    else {
                        this.controlToken = index;
                        break;
                    }
                }
                if (this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.PCOMA) {
                    this.tabulaciones++;
                    this.traduccion.push(this.tabs() + "if " + temp + " :");
                    this.tabulaciones++;
                    this.traduccion.push(this.tabs() + "break");
                    this.tabulaciones -= 2;
                }
                else {
                    this.traduccion.push(this.tabs() + "while " + temp + " :");
                    this.tabulaciones++;
                }
            }
            else if (this.tockenActual.token == Token_2.TypeToken.DO) {
                this.traduccion.push(this.tabs() + "while True:");
                this.tabulaciones++;
            }
            else if (this.tockenActual.token == Token_2.TypeToken.IF) {
                if (this.listaTokens[this.controlToken - 1].token == Token_2.TypeToken.ELSE) {
                    let temp = "";
                    for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != Token_2.TypeToken.PARENTESISDER) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        }
                        else {
                            this.controlToken = index;
                            break;
                        }
                    }
                    this.traduccion.push(this.tabs() + "elif " + temp + " :");
                    this.tabulaciones++;
                }
                else {
                    let temp = "";
                    for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != Token_2.TypeToken.PARENTESISDER) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        }
                        else {
                            this.controlToken = index;
                            break;
                        }
                    }
                    this.traduccion.push(this.tabs() + "if " + temp + " :");
                    this.tabulaciones++;
                }
            }
            else if (this.tockenActual.token == Token_2.TypeToken.ELSE) {
                if (this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.IF) {
                }
                else {
                    this.traduccion.push(this.tabs() + "else :");
                    this.tabulaciones++;
                }
            }
            else if (this.tockenActual.token == Token_2.TypeToken.BREAK) {
                this.traduccion.push(this.tabs() + "break");
            }
            else if (this.tockenActual.token == Token_2.TypeToken.CONTINUE) {
                this.traduccion.push(this.tabs() + "continue");
            }
            else if (this.tockenActual.token == Token_2.TypeToken.RETURN) {
                let temp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    if (this.listaTokens[index].token != Token_2.TypeToken.PCOMA) {
                        temp = temp + "" + this.listaTokens[index].lexema;
                    }
                    else {
                        this.controlToken = index;
                        break;
                    }
                }
                this.traduccion.push(this.tabs() + "return " + temp);
            }
            else if (this.tockenActual.token == Token_2.TypeToken.SYSTEM && this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.PUNTO && this.listaTokens[this.controlToken + 2].token == Token_2.TypeToken.OUT) {
                if (this.listaTokens[this.controlToken + 4].token == Token_2.TypeToken.PRINTLN) {
                    let temp = "";
                    for (let index = this.controlToken + 6; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != Token_2.TypeToken.PCOMA) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        }
                        else {
                            this.controlToken = index;
                            break;
                        }
                    }
                    this.traduccion.push(this.tabs() + "print(" + temp + ";");
                }
                else {
                    let temp = "";
                    for (let index = this.controlToken + 6; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != Token_2.TypeToken.PARENTESISDER && this.listaTokens[index + 1].token != Token_2.TypeToken.PCOMA) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        }
                        else {
                            this.controlToken = index;
                            break;
                        }
                    }
                    this.traduccion.push(this.tabs() + "print(" + temp + ",end=\"\"" + ");");
                }
            }
            else if (this.tockenActual.token == Token_2.TypeToken.STRING || this.tockenActual.token == Token_2.TypeToken.INT || this.tockenActual.token == Token_2.TypeToken.CHAR || this.tockenActual.token == Token_2.TypeToken.BOOLEAN || this.tockenActual.token == Token_2.TypeToken.FLOAT || this.tockenActual.token == Token_2.TypeToken.DOUBLE) {
                let temp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    this.tockenActual = this.listaTokens[index + 1];
                    if (this.tockenActual.token != Token_2.TypeToken.PCOMA) {
                        if (this.tockenActual.token != Token_2.TypeToken.LLAVEIZQ) {
                            temp = temp + "" + this.listaTokens[index].lexema;
                        }
                        else {
                            temp = temp + "" + this.listaTokens[index].lexema;
                            this.controlToken = index;
                            break;
                        }
                    }
                    else {
                        this.controlToken = index;
                        break;
                    }
                }
                this.traduccion.push(this.tabs() + "var " + temp);
            }
            else if (this.tockenActual.token == Token_2.TypeToken.PUBLIC || this.tockenActual.token == Token_2.TypeToken.PRIVATE || this.tockenActual.token == Token_2.TypeToken.PROTECTED) {
                if (this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.VOID || this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.STRING || this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.INT || this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.CHAR || this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.BOOLEAN || this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.FLOAT || this.listaTokens[this.controlToken + 1].token == Token_2.TypeToken.DOUBLE) {
                    let temp1 = "";
                    for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                        if (this.listaTokens[index].token != Token_2.TypeToken.PARENTESISDER) {
                            temp1 = temp1 + " " + this.listaTokens[index].lexema;
                        }
                        else {
                            temp1 = temp1 + " " + this.listaTokens[index].lexema;
                            this.controlToken = index;
                            break;
                        }
                    }
                    this.traduccion.push(this.tabs() + "self" + " " + temp1 + ":");
                    this.tabulaciones++;
                }
            }
            else if (this.tockenActual.token == Token_2.TypeToken.FOR) {
                //for(int f=0;f>5*4;f++)
                //for(f;f>5*4;f++)
                this.tockenActual = this.listaTokens[this.controlToken + 3];
                if (this.tockenActual.token == Token_2.TypeToken.NUMERO || this.tockenActual.token == Token_2.TypeToken.ID) {
                    let temp = this.tockenActual.lexema;
                    this.tockenActual = this.listaTokens[this.controlToken + 4];
                    if (this.tockenActual.token == Token_2.TypeToken.ASIGNACION) {
                        this.tockenActual = this.listaTokens[this.controlToken + 5];
                        if (this.tockenActual.token == Token_2.TypeToken.NUMERO || this.tockenActual.token == Token_2.TypeToken.ID) {
                            let tempp = this.tockenActual.lexema; // guarda el numero de la declaracion del for (int f=9)
                            this.tockenActual = this.listaTokens[this.controlToken + 8];
                            if (this.tockenActual.token == Token_2.TypeToken.ASIGNACION || this.tockenActual.token == Token_2.TypeToken.ADMIRACION) {
                                this.tockenActual = this.listaTokens[this.controlToken + 10];
                                let temppp = this.tockenActual.lexema;
                                for (let index = this.controlToken + 11; index < this.listaTokens.length; index++) {
                                    if (this.listaTokens[index].token != Token_2.TypeToken.PCOMA) {
                                        temppp = temppp + "" + this.listaTokens[index].lexema;
                                    }
                                    else {
                                        this.controlToken = index + 4;
                                        break;
                                    }
                                }
                                this.traduccion.push(this.tabs() + "for " + temp + " in range(" + tempp + "," + temppp + "):");
                                this.tabulaciones++;
                            }
                            else if (this.tockenActual.token == Token_2.TypeToken.MAYORQ || this.tockenActual.token == Token_2.TypeToken.MENORQ) {
                                this.tockenActual = this.listaTokens[this.controlToken + 9];
                                if (this.tockenActual.token == Token_2.TypeToken.ASIGNACION) {
                                    this.tockenActual = this.listaTokens[this.controlToken + 10];
                                    let temppp = this.tockenActual.lexema;
                                    for (let index = this.controlToken + 11; index < this.listaTokens.length; index++) {
                                        if (this.listaTokens[index].token != Token_2.TypeToken.PCOMA) {
                                            temppp = temppp + "" + this.listaTokens[index].lexema;
                                        }
                                        else {
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
                                        if (this.listaTokens[index].token != Token_2.TypeToken.PCOMA) {
                                            temppp = temppp + "" + this.listaTokens[index].lexema;
                                        }
                                        else {
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
            else if (this.tockenActual.token == Token_2.TypeToken.ID) {
                let temp = this.tockenActual.lexema;
                let temppp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    if (this.listaTokens[index].token != Token_2.TypeToken.PCOMA) {
                        temppp = temppp + "" + this.listaTokens[index].lexema;
                    }
                    else {
                        this.controlToken = index;
                        break;
                    }
                }
                this.traduccion.push(this.tabs() + "" + temp + temppp);
            }
            else if (this.tockenActual.token == Token_2.TypeToken.LLAVEDER) {
                if (this.tabulaciones > 0) {
                    this.tabulaciones--;
                }
                if (main) {
                    cermain = true;
                }
            }
            this.controlToken++;
            if (this.tockenActual.token == Token_2.TypeToken.NINGUNO) {
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
    getCodigoTrad() {
        return this.codigoTrad;
    }
    tabs() {
        let tabss = "";
        for (let i = 0; i < this.tabulaciones; i++) {
            tabss = tabss + "\t";
        }
        return tabss;
    }
    agregarUltimo() {
        this.listaTokens.push(new Token_1.Token(Token_2.TypeToken.NINGUNO, ''));
    }
}
exports.Traduccion = Traduccion;
