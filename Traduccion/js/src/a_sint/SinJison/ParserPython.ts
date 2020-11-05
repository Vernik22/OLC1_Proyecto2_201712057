import { Token } from "../../a_lex/Token"
import { TypeToken } from "../../a_lex/Token"
import { Tsplit } from "../../routes/manejoText";

export class Parser {

    listaTokens: Token[];
    errorSintatico: String[];
    preAnalisis: number;
    pos: number;

    constructor(listaTokens: Token[]) {
        this.preAnalisis = -1;
        this.listaTokens = listaTokens;
        this.errorSintatico = [];
        this.pos = 0;
        this.quitarComentarios();
    }

    emparejar(terminal: TypeToken) {
        if (this.pos >= this.listaTokens.length) {
            return;
        }
        if (this.preAnalisis == terminal) {
            console.log("token correcto; " + this.listaTokens[this.pos].token)
            this.pos++;
            if (this.pos < this.listaTokens.length) {
                this.preAnalisis = this.listaTokens[this.pos].token;
            }
        } else {
            console.log("Se encontro error sintactico, no se esperaba: " + this.preAnalisis.toString() + " val:" + this.listaTokens[this.pos].lexema);
            this.errorSintatico.push("error sintactico no se esperaba: " + this.preAnalisis.toString() + " val:" + this.listaTokens[this.pos].lexema);
            //RECUPERACION DE ERRORES
            while (this.pos < this.listaTokens.length) {
                //console.log(this.lista_Tokens[this.pos].token+" == "+TypeToken.T_PYCOMA)  
                if (this.listaTokens[this.pos].token == TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == TypeToken.CLASS) {
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                } else if (this.listaTokens[this.pos].token == TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == TypeToken.INTERFACE) {
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                } else if (this.listaTokens[this.pos].token == TypeToken.IF || this.listaTokens[this.pos].token == TypeToken.FOR || this.listaTokens[this.pos].token == TypeToken.WHILE || this.listaTokens[this.pos].token == TypeToken.DO) {
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                } else
                    if (this.listaTokens[this.pos].token == TypeToken.PCOMA
                        || this.listaTokens[this.pos].token == TypeToken.LLAVEDER) {
                        this.pos++;
                        this.preAnalisis = this.listaTokens[this.pos].token;
                        break;
                    }
                this.pos++;
            }
            if (this.preAnalisis == TypeToken.PUBLIC && this.preAnalisis + 1 == TypeToken.CLASS) {
                this.BIGINCOI();
            } else if (this.preAnalisis == TypeToken.PUBLIC && this.preAnalisis + 1 == TypeToken.INTERFACE) {
                this.BIGINCOI();
            } else if (this.preAnalisis == TypeToken.IF || this.preAnalisis == TypeToken.FOR || this.preAnalisis == TypeToken.WHILE || this.preAnalisis == TypeToken.DO) {
                this.CUERPO();

            } else
                if (this.preAnalisis == TypeToken.ID) {
                    this.METODOS();
                }
        }
    }
    //-----------------GRAMATICA---------------
    Analizar() {
        this.preAnalisis = this.listaTokens[0].token;
        this.ARCHIVOBIGIN();
        console.log("Fin del analisis sintactico....!");
    }

    ARCHIVOBIGIN() {
        this.IMPORTBIGIN();
        this.BIGINCOI();
    }

    IMPORTBIGIN() {
        if (this.preAnalisis == TypeToken.PACKAGE) {
            this.emparejar(TypeToken.PACKAGE);
            this.PACKAGEBODY();
            this.emparejar(TypeToken.PCOMA);

        } else if (this.preAnalisis == TypeToken.IMPORT) {
            this.emparejar(TypeToken.IMPORT);
            this.PACKAGEBODY();
            this.emparejar(TypeToken.PCOMA);
        } else {
            //EPSILON
        }
    }

    BIGINCOI() {
        if (this.preAnalisis == TypeToken.PUBLIC) {
            this.emparejar(TypeToken.PUBLIC);
            this.CI2();
        }
    }

    CI2() {
        if (this.preAnalisis == TypeToken.CLASS) {
            this.CLASSBIGIN();
            this.BIGINCOI();
        } else if (this.preAnalisis == TypeToken.INTERFACE) {
            this.INTERFACEBIGIN();
            this.BIGINCOI();
        } else {
            //EPSILON
        }

    }

    CLASSBIGIN() {
        this.emparejar(TypeToken.CLASS);
        this.emparejar(TypeToken.ID);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.METODOS();
        this.emparejar(TypeToken.LLAVEDER);
        this.BIGINCOI();
    }

    INTERFACEBIGIN() {
        this.emparejar(TypeToken.INTERFACE);
        this.emparejar(TypeToken.ID);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.CUERPOINT();
        this.emparejar(TypeToken.LLAVEDER);
        this.BIGINCOI();
    }

    MAIN() {
        this.emparejar(TypeToken.PUBLIC);
        this.emparejar(TypeToken.STATIC);
        this.emparejar(TypeToken.VOID);
        this.emparejar(TypeToken.ID);
        this.emparejar(TypeToken.PARENTESISIZQ);
        this.TIPO();
        this.emparejar(TypeToken.CORCHETEIZQ);
        this.emparejar(TypeToken.CORCHETEDER);
        this.emparejar(TypeToken.ID);
        this.emparejar(TypeToken.PARENTESISDER);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(TypeToken.LLAVEDER);
    }

    IMPRIMIR() {
        this.emparejar(TypeToken.SYSTEM);
        this.emparejar(TypeToken.PUNTO);
        this.emparejar(TypeToken.OUT);
        this.emparejar(TypeToken.PUNTO);
        this.PRINTTYPE();
        this.emparejar(TypeToken.PARENTESISIZQ);
        this.IMPCUE();
        this.emparejar(TypeToken.PARENTESISDER);
        this.emparejar(TypeToken.PCOMA);
    }

    PRINTTYPE() {
        if (this.preAnalisis == TypeToken.PRINTLN) {
            this.emparejar(TypeToken.PRINTLN)
        } else if (this.preAnalisis == TypeToken.PRINT) {
            this.emparejar(TypeToken.PRINT)
        }
    }

    IMPCUE() {
        //Probar cadenas vacias
        if (this.preAnalisis == TypeToken.COMILLAS) {
            this.emparejar(TypeToken.COMILLAS);
            this.IMPCUEP();
            this.emparejar(TypeToken.COMILLAS);
            this.IMPCUE();
        } else if (this.preAnalisis == TypeToken.COMILLASIMPLE) {
            this.emparejar(TypeToken.COMILLASIMPLE);
            this.IMPCUEP();
            this.emparejar(TypeToken.COMILLASIMPLE);
            this.IMPCUE();
        } else if (this.preAnalisis == TypeToken.ID) {
            this.emparejar(TypeToken.ID);
            this.IMPCUE();
        } else if (this.preAnalisis == TypeToken.NUMERO || this.preAnalisis == TypeToken.MAS || this.preAnalisis == TypeToken.GUION) {
            this.E();
            this.IMPCUE();
        } else {

            //EPSILON
        }
    }
    IMPCUEP() {
        if (this.preAnalisis == TypeToken.CADENA) {
            this.emparejar(TypeToken.CADENA);
        } else {
            //epsilon
        }
    }

    METODOS() {
        if (this.preAnalisis == TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == TypeToken.STATIC && this.listaTokens[this.pos + 2].token == TypeToken.VOID) {
            this.MAIN();
            this.METODOS();
        } else if (this.preAnalisis == TypeToken.PUBLIC || this.preAnalisis == TypeToken.PRIVATE || this.preAnalisis == TypeToken.PROTECTED) {
            this.MODIFICADOR();
            this.TIPO();
            this.emparejar(TypeToken.ID);
            this.METODOSP();
        } else if (this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            this.DECLARACION();
            this.METODOS();
        } else {
            //epsilon
        }

    }
    METODOSP() {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            this.emparejar(TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(TypeToken.PARENTESISDER);
            this.emparejar(TypeToken.LLAVEIZQ);
            this.CUERPO();
            this.emparejar(TypeToken.LLAVEDER);
            this.METODOS();
        } else if (this.preAnalisis == TypeToken.PCOMA) {
            this.emparejar(TypeToken.PCOMA);
            this.METODOS();
        }
        else {
            this.DECLARACIONP();
            this.METODOS();
        }
    }

    CUERPOINT() {
        if (this.preAnalisis == TypeToken.PUBLIC || this.preAnalisis == TypeToken.PRIVATE || this.preAnalisis == TypeToken.PROTECTED) {
            this.MODIFICADOR();
            this.TIPO();
            this.emparejar(TypeToken.ID);
            this.emparejar(TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(TypeToken.PARENTESISDER);
            this.emparejar(TypeToken.PCOMA);
            this.CUERPOINT();
        } else if (this.preAnalisis == TypeToken.VOID || this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            this.TIPO();
            this.emparejar(TypeToken.ID);
            this.CUERPOINTP();
            this.CUERPOINT();
        } else {
            //Epsilon
        }
    }
    CUERPOINTP() {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            this.emparejar(TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(TypeToken.PARENTESISDER);
            this.emparejar(TypeToken.PCOMA);
        } else if (this.preAnalisis == TypeToken.ASIGNACION) {
            this.emparejar(TypeToken.ASIGNACION);
            this.E();
            this.emparejar(TypeToken.PCOMA);
        }
    }

    PARAMETROS() {
        if (this.preAnalisis == TypeToken.VOID || this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            this.TIPO();
            this.emparejar(TypeToken.ID);
            this.PRPR();
        } else {
            //epsilon
        }
    }
    PRPR() {
        if (this.preAnalisis == TypeToken.COMA) {
            this.emparejar(TypeToken.COMA);
            this.PARAMETROS();
        } else {
            //Epsilon
        }
    }

    CUERPO() {
        if (this.preAnalisis == TypeToken.IF) {
            this.SIF();
            this.CUERPO();
        } else if (this.preAnalisis == TypeToken.FOR) {
            this.SFOR();
            this.CUERPO();
        } else if (this.preAnalisis == TypeToken.WHILE) {
            this.SWHILE();
            this.CUERPO();
        } else if (this.preAnalisis == TypeToken.DO) {
            this.SDOWHILE();
            this.CUERPO();
        } else if (this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            this.DECLARACION();
            this.CUERPO();
        } else if (this.preAnalisis == TypeToken.SYSTEM && this.listaTokens[this.pos + 1].token == TypeToken.PUNTO && this.listaTokens[this.pos + 2].token == TypeToken.OUT) {
            this.IMPRIMIR();
            this.CUERPO();
        } else if (this.preAnalisis == TypeToken.ID) {
            if (this.listaTokens[this.pos + 1].token == TypeToken.PARENTESISIZQ) {
                this.emparejar(TypeToken.ID);
                this.LLMETOD();
                this.CUERPO();
            } else if (this.listaTokens[this.pos + 1].token == TypeToken.MAS || this.listaTokens[this.pos + 1].token == TypeToken.GUION) {
                this.E();
                this.ASIGNACION();
                this.DECLARACION();
                this.CUERPO();
            } else {
                this.ASIGNACION();
                this.DECLARACION();
                this.CUERPO();
            }


        } else if (this.preAnalisis == TypeToken.RETURN) {
            this.emparejar(TypeToken.RETURN);
            this.RETURNCUE();
            this.emparejar(TypeToken.PCOMA);
        } else if (this.preAnalisis == TypeToken.CONTINUE) {
            this.emparejar(TypeToken.CONTINUE);
            this.emparejar(TypeToken.PCOMA);
        } else if (this.preAnalisis == TypeToken.BREAK) {
            this.emparejar(TypeToken.BREAK);
            this.emparejar(TypeToken.PCOMA);
        } else {
            //EPSILON
        }
    }
    LLMETOD() {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            this.emparejar(TypeToken.PARENTESISIZQ);
            this.ASIGNACION();
            this.DECLARACIONP();
            this.emparejar(TypeToken.PARENTESISDER);
            this.emparejar(TypeToken.PCOMA);
        }
    }
    RETURNCUE() {
        if (this.preAnalisis == TypeToken.COMILLAS) {
            this.emparejar(TypeToken.COMILLAS);
            this.IMPCUEP();
            this.emparejar(TypeToken.COMILLAS);
            this.RETURNCUE();
        } else if (this.preAnalisis == TypeToken.COMILLASIMPLE) {
            this.emparejar(TypeToken.COMILLASIMPLE);
            this.IMPCUEP();
            this.emparejar(TypeToken.COMILLASIMPLE);
            this.RETURNCUE();
        } else if (this.preAnalisis == TypeToken.ID) {
            this.emparejar(TypeToken.ID);
            this.RETURNCUE();
        }
        else if (this.preAnalisis == TypeToken.NUMERO || this.preAnalisis == TypeToken.MAS || this.preAnalisis == TypeToken.GUION) {
            this.E();
            this.RETURNCUE()
        } else {
            //epsilon
        }
    }

    //revisar el punto y coma despues de la declaracion
    SFOR() {
        this.emparejar(TypeToken.FOR);
        this.emparejar(TypeToken.PARENTESISIZQ);
        this.DECLARACION();

        this.EXP();
        this.emparejar(TypeToken.PCOMA);
        this.EXP();
        this.emparejar(TypeToken.PARENTESISDER);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(TypeToken.LLAVEDER);
    }

    SWHILE() {
        this.emparejar(TypeToken.WHILE);
        this.emparejar(TypeToken.PARENTESISIZQ);
        this.EXP();
        this.emparejar(TypeToken.PARENTESISDER);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(TypeToken.LLAVEDER);
    }

    SDOWHILE() {
        this.emparejar(TypeToken.DO);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(TypeToken.LLAVEDER);
        this.emparejar(TypeToken.WHILE);
        this.emparejar(TypeToken.PARENTESISIZQ);
        this.EXP();
        this.emparejar(TypeToken.PARENTESISDER);
        this.emparejar(TypeToken.PCOMA);
    }

    SIF() {
        this.emparejar(TypeToken.IF);
        this.emparejar(TypeToken.PARENTESISIZQ);
        this.EXP();
        this.emparejar(TypeToken.PARENTESISDER);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(TypeToken.LLAVEDER);
        this.ELSE();
    }

    ELSE() {
        if (this.preAnalisis == TypeToken.ELSE) {
            this.emparejar(TypeToken.ELSE);
            this.ELSE2();
        } else {
            //epsilon
        }
    }

    ELSE2() {
        if (this.preAnalisis == TypeToken.IF) {
            this.SIF();
        } else if (this.preAnalisis == TypeToken.LLAVEIZQ) {
            this.emparejar(TypeToken.LLAVEIZQ);
            this.CUERPO();
            this.emparejar(TypeToken.LLAVEDER);
        } else {
            //epsilon
        }
    }

    EXP() {
        if (this.preAnalisis == TypeToken.ADMIRACION) {
            this.emparejar(TypeToken.ADMIRACION);
            this.E();
            this.EXPP();
        } else {
            this.E();
            this.EXPP();
        }
    }

    EXPP() {
        if (this.preAnalisis == TypeToken.AND) {
            this.emparejar(TypeToken.AND);
            this.emparejar(TypeToken.AND);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.OR) {
            this.emparejar(TypeToken.OR);
            this.emparejar(TypeToken.OR);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.XOR) {
            this.emparejar(TypeToken.XOR);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.MAYORQ && this.listaTokens[this.pos + 1].token == TypeToken.ASIGNACION) {
            this.emparejar(TypeToken.MAYORQ);
            this.emparejar(TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.MENORQ && this.listaTokens[this.pos + 1].token == TypeToken.ASIGNACION) {
            this.emparejar(TypeToken.MENORQ);
            this.emparejar(TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.MAYORQ) {
            this.emparejar(TypeToken.MAYORQ);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.MENORQ) {
            this.emparejar(TypeToken.MENORQ);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.ASIGNACION) {
            this.emparejar(TypeToken.ASIGNACION);
            this.emparejar(TypeToken.ASIGNACION);
            this.E();
            this.EXP();

        } else if (this.preAnalisis == TypeToken.ADMIRACION) {
            this.emparejar(TypeToken.ADMIRACION);
            this.emparejar(TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        }
    }

    E() {
        this.T();
        this.EP();
    }

    EP() {
        if (this.preAnalisis == TypeToken.MAS) {
            this.emparejar(TypeToken.MAS);
            this.T();
            this.EP();
        } else if (this.preAnalisis == TypeToken.GUION) {
            this.emparejar(TypeToken.GUION);
            this.T();
            this.EP();
        } else {
            //epsilon
        }
    }

    T() {
        this.F();
        this.TP();
    }

    TP() {
        if (this.preAnalisis == TypeToken.ASTERISCO) {
            this.emparejar(TypeToken.ASTERISCO);
            this.F();
            this.TP();
        } else if (this.preAnalisis == TypeToken.DIAGONAL) {
            this.emparejar(TypeToken.DIAGONAL);
            this.F();
            this.TP();
            //Agregar punto para probar
        }else if(this.preAnalisis == TypeToken.PUNTO){
            this.emparejar(TypeToken.PUNTO);
            this.F();
            this.TP();
        } else {
            //epsilon
        }
    }

    F() {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            this.emparejar(TypeToken.PARENTESISIZQ);
            this.E();
            this.emparejar(TypeToken.PARENTESISDER);
        } else if (this.preAnalisis == TypeToken.NUMERO) {
            this.emparejar(TypeToken.NUMERO);
            this.E();
        } else if (this.preAnalisis == TypeToken.GUION) {
            this.emparejar(TypeToken.GUION);
            this.F();
        }else if(this.preAnalisis == TypeToken.TRUE || this.preAnalisis == TypeToken.FALSE){
            if (this.preAnalisis == TypeToken.TRUE) {
                this.emparejar(TypeToken.TRUE);
                this.E();
            }else{
                this.emparejar(TypeToken.FALSE);
                this.E();
            }
           
        } else if (this.preAnalisis == TypeToken.ID) {
            this.emparejar(TypeToken.ID);
            this.E();
        } else if (this.preAnalisis == TypeToken.COMILLAS || this.preAnalisis == TypeToken.COMILLASIMPLE) {
            if (this.preAnalisis == TypeToken.COMILLAS) {
                this.emparejar(TypeToken.COMILLAS);
                this.IMPCUEP();
                this.emparejar(TypeToken.COMILLAS);
                this.E();
            } else {
                this.emparejar(TypeToken.COMILLASIMPLE);
                this.IMPCUEP();
                this.emparejar(TypeToken.COMILLASIMPLE);
                this.E();
            }
        } else {
            //nada
        }

    }

    TIPO() {
        if (this.preAnalisis == TypeToken.VOID) {
            this.emparejar(TypeToken.VOID);

        } else if (this.preAnalisis == TypeToken.STRING) {
            this.emparejar(TypeToken.STRING);

        } else if (this.preAnalisis == TypeToken.INT) {
            this.emparejar(TypeToken.INT);

        } else if (this.preAnalisis == TypeToken.CHAR) {
            this.emparejar(TypeToken.CHAR);

        } else if (this.preAnalisis == TypeToken.BOOLEAN) {
            this.emparejar(TypeToken.BOOLEAN);

        } else if (this.preAnalisis == TypeToken.FLOAT) {
            this.emparejar(TypeToken.FLOAT);

        } else if (this.preAnalisis == TypeToken.DOUBLE) {
            this.emparejar(TypeToken.DOUBLE);

        }
    }

    MODIFICADOR() {
        if (this.preAnalisis == TypeToken.PUBLIC) {
            this.emparejar(TypeToken.PUBLIC);

        } else if (this.preAnalisis == TypeToken.PRIVATE) {
            this.emparejar(TypeToken.PRIVATE);

        } else if (this.preAnalisis == TypeToken.PROTECTED) {
            this.emparejar(TypeToken.PROTECTED);

        } else {
            //EPSILON
        }
    }

    PACKAGEBODY() {
        this.emparejar(TypeToken.ID);
        this.PP();
        this.emparejar(TypeToken.PCOMA);
    }
    PP() {
        if (this.preAnalisis == TypeToken.PUNTO) {
            this.emparejar(TypeToken.PUNTO);
            this.PP();
        } else if (this.preAnalisis == TypeToken.ASTERISCO) {
            this.emparejar(TypeToken.ASTERISCO);
            this.PP();
        } else if (this.preAnalisis == TypeToken.ID) {
            this.emparejar(TypeToken.ID);
            this.PP();
        } else {
            //EPSILON
        }
    }

    DECLARACION() {
        this.TIPO();
        if (this.preAnalisis == TypeToken.CORCHETEIZQ) {
            this.emparejar(TypeToken.CORCHETEIZQ);
            this.emparejar(TypeToken.CORCHETEDER);
        }
        this.ASIGNACION();
        this.DECLARACIONP();
        this.emparejar(TypeToken.PCOMA);
    }

    DECLARACIONP() {
        //if (this.preAnalisis == TypeToken.PCOMA) {
        // this.emparejar(TypeToken.PCOMA);
        //} else 
        if (this.preAnalisis == TypeToken.COMA) {
            this.emparejar(TypeToken.COMA);
            this.ASIGNACION();
            this.DECLARACIONP();
        } else {
            //EPSILON
        }
    }

    ASIGNACION() {
        if (this.preAnalisis == TypeToken.ID) {
            this.emparejar(TypeToken.ID);
            this.ASIGNACION();
        } else if (this.preAnalisis == TypeToken.ASIGNACION) {
            this.emparejar(TypeToken.ASIGNACION);
            this.ASIGP()
            this.E();
            this.ASIGNACION();
        }
        //else if (this.preAnalisis==TypeToken.PCOMA) {
        //   this.emparejar(TypeToken.PCOMA);
        //}
        else {
            //EPSILON
        }
    }

    ASIGP() {
        if (this.preAnalisis == TypeToken.NEW) {
            this.emparejar(TypeToken.NEW);
            this.emparejar(TypeToken.ID);
            this.emparejar(TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(TypeToken.PARENTESISDER);
            this.emparejar(TypeToken.PCOMA);
            this.ASIGNACION();
        }
    }

    getListaErrores(): String[] {
        return this.errorSintatico;
    }

    quitarComentarios() {
        var auxTokens = [];
        for (let index = 0; index < this.listaTokens.length; index++) {
            if (this.listaTokens[index].token == TypeToken.DIAGONAL) {
                if (this.listaTokens[index + 1].token == TypeToken.DIAGONAL) {
                    index = index + 2;
                } else if (this.listaTokens[index + 1].token == TypeToken.ASTERISCO) {
                    index = index + 4
                } else {
                    auxTokens.push(this.listaTokens[index]);
                }

            } else {
                auxTokens.push(this.listaTokens[index]);
            }

        }
        this.listaTokens = auxTokens;
    }
}