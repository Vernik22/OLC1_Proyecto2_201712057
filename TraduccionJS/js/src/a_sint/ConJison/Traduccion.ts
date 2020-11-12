

export class Traduccion {
    controlToken: number;
    tockenActual: string[];
    listaTokens: string[];
    traduccion: string[];
    codigoTrad: string;

    constructor(listaTokens: string[]) {
        this.controlToken = 0;
        this.tockenActual = [];
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
            this.tockenActual = this.listaTokens[this.controlToken].split(',');
            let tocken_1 = this.listaTokens[this.controlToken + 1].split(',');
            let tocken_2 = this.listaTokens[this.controlToken + 2].split(',');

            if (this.tockenActual[0] == "class" || this.tockenActual[0] == "interface") {
                this.tockenActual = this.listaTokens[this.controlToken + 1].split(',');
                this.traduccion.push("class" + " " + this.tockenActual[1] + "{");
                this.traduccion.push("constructor" + " (" + ")" + "{");
                this.traduccion.push("}");
                this.controlToken += 1;
            } else if (this.tockenActual[0] == "public" && tocken_1[0] == "static" && tocken_2[0] == "void") {
                let tocken_3 = this.listaTokens[this.controlToken + 3].split(',');

                let temp = "";
                for (let index = this.controlToken + 4; index < this.listaTokens.length; index++) {
                    let t = this.listaTokens[index].split(',')
                    if (t[0] != "ParentesisDer") {
                        temp = temp + "" + t[1];

                    } else {
                        temp = temp + "" + t[1];
                        this.controlToken = index + 1;
                        break;

                    }

                }
                this.traduccion.push("function" + " " + tocken_3[1] + temp + "{");

            } else if (this.tockenActual[0] == "ComentarioUni") {
                this.traduccion.push("//" + this.tockenActual[1]);

            } else if (this.tockenActual[0] == "ComentarioMulti") {
                this.traduccion.push("/*" + this.tockenActual[1] + "*/");
            } else if (this.tockenActual[0] == "System" && tocken_1[0] == "punto" && tocken_2[0] == "out") {
                let temp = "";
                for (let index = this.controlToken + 6; index < this.listaTokens.length; index++) {
                    let t = this.listaTokens[index].split(',')
                    if (t[0] != "PuntoyComa") {
                        temp = temp + "" + t[1];
                    } else {

                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push("console.log(" + temp + ";");
            } else if (this.tockenActual[0] == "break") {
                this.traduccion.push("break;");
            } else if (this.tockenActual[0] == "continue") {
                this.traduccion.push("continue;");
            } else if (this.tockenActual[0] == "return") {
                let temp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    let t = this.listaTokens[index].split(',');
                    if (t[0] != "PuntoyComa") {
                        temp = temp + "" + t[1];
                    } else {

                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push("return " + temp + ";");
            } else if (this.tockenActual[0] == "if") {
                let t = this.listaTokens[this.controlToken - 1].split(',')
                if (t[0] == "else") {
                    let temp = "";
                    for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                        let tt = this.listaTokens[index].split(',')

                        if (tt[0] != "LlaveIzq") {
                            temp = temp + "" + tt[1];
                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push("else if " + temp + " {");
                } else {
                    let temp = "";
                    for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                        let tt = this.listaTokens[index].split(',')
                        if (tt[0] != "LlaveIzq") {
                            temp = temp + "" + tt[1];
                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push("if " + temp + " {");
                }

            } else if (this.tockenActual[0] == "else") {
                let t = this.listaTokens[this.controlToken + 1].split(',')
                if (t[0] == "if") {

                } else {
                    this.traduccion.push("else {");
                }
            } else if (this.tockenActual[0] == "while") {
                let temp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    let t = this.listaTokens[index].split(',');
                    if (t[0] != "ParentesisDer") {
                        temp = temp + "" + t[1];
                    } else {
                        temp = temp + "" + t[1];
                        this.controlToken = index;
                        break;
                    }

                }
                let t = this.listaTokens[this.controlToken + 1].split(',');
                if (t[0] == "PuntoyComa") {
                    this.traduccion.push("while " + temp + " ;")
                } else {
                    this.traduccion.push("while " + temp + " {");

                }


            } else if (this.tockenActual[0] == "do") {
                this.traduccion.push("do{");
            } else if (this.tockenActual[0] == "for") {
                let temp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    let t = this.listaTokens[index].split(',');
                    if (t[0] != "LlaveIzq") {
                        temp = temp + "" + t[1];
                    } else {
                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push("for " + temp + "{")
            } else if (this.tockenActual[0] == "id") {
                let temp = this.tockenActual[1];
                let temppp = "";
                for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                    let t = this.listaTokens[index].split(',');
                    if (t[0] != "PuntoyComa") {
                        temppp = temppp + "" + t[1];
                    } else {

                        this.controlToken = index;
                        break;
                    }

                }
                this.traduccion.push(temp + temppp + ";");

            } else if (this.tockenActual[0] == "public" || this.tockenActual[0] == "private" || this.tockenActual[0] == "protected") {
                if (tocken_1[0] == "void" || tocken_1[0] == "string" || tocken_1[0] == "int" || tocken_1[0] == "char" || tocken_1[0] == "boolean" || tocken_1[0] == "float" || tocken_1[0] == "double") {
                    let temp1 = "";
                    for (let index = this.controlToken + 2; index < this.listaTokens.length; index++) {
                        let t = this.listaTokens[index].split(',');
                        if (t[0] != "ParentesisDer") {
                            temp1 = temp1 + " " + t[1];
                        } else {
                            temp1 = temp1 + " " + t[1];
                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push("function" + " " + temp1 + "{");



                }
            } else if (this.tockenActual[0] == "string" || this.tockenActual[0] == "int" || this.tockenActual[0] == "char" || this.tockenActual[0] == "boolean" || this.tockenActual[0] == "float" || this.tockenActual[0] == "double") {
                if (tocken_2[0] == "ParentesisIzq") {
                    let temp = "";
                    for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                        let t = this.listaTokens[index].split(',');


                        if (t[0] != "LlaveIzq") {
                            temp = temp + "" + t[1];


                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push("function " + temp + "{");
                } else {
                    let temp = "";
                    for (let index = this.controlToken + 1; index < this.listaTokens.length; index++) {
                        let t = this.listaTokens[index].split(',');


                        if (t[0] != "PuntoyComa") {
                            temp = temp + "" + t[1];


                        } else {

                            this.controlToken = index;
                            break;
                        }

                    }
                    this.traduccion.push("var " + temp + ";");

                }
            }

            else if (this.tockenActual[0] == "LlaveDer") {
                this.traduccion.push("}")
            }

            this.controlToken++;
            let tsplit = this.listaTokens[this.controlToken].split(',');
            if (tsplit[0] == "ULTIMO") {
                ultimo = false;
            }
        }
        this.crearTraduccion();
    }

    crearTraduccion() {
        for (let i = 0; i < this.traduccion.length; i++) {
            if (this.traduccion[i] != null) {

                this.codigoTrad = this.codigoTrad + "" + this.traduccion[i] + "\n";

            }

        }
    }
    getCodigoTrad(): string {
        return this.codigoTrad;
    }
    agregarUltimo() {
        this.listaTokens.push("ULTIMO", "");
    }

}