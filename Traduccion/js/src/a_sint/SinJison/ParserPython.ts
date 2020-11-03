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
                if (this.listaTokens[this.pos].token == TypeToken.PCOMA
                    || this.listaTokens[this.pos].token == TypeToken.LLAVEDER) {
                    this.pos++;
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                }
                this.pos++;
            }
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
        } else if (this.preAnalisis == TypeToken.INTERFACE) {
            this.INTERFACEBIGIN();
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
        this.CI2();
    }

    INTERFACEBIGIN() {
        this.emparejar(TypeToken.INTERFACE);
        this.emparejar(TypeToken.ID);
        this.emparejar(TypeToken.LLAVEIZQ);
        this.CUERPOINT();
        this.emparejar(TypeToken.LLAVEDER);
        this.CI2();
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
            if (this.preAnalisis == TypeToken.CADENA) {
                this.emparejar(TypeToken.CADENA);
            }
            this.emparejar(TypeToken.COMILLAS);
            this.IMPCUE();
        } else if (this.preAnalisis == TypeToken.COMILLASIMPLE) {

        } else if (this.preAnalisis == TypeToken.ID) {

        } else if (this.preAnalisis == TypeToken.NUMERO || this.preAnalisis == TypeToken.MAS || this.preAnalisis == TypeToken.GUION) {
            this.E();
        } else {

            //EPSILON
        }
    }

    METODOS() {
        if (this.preAnalisis == TypeToken.PUBLIC && this.preAnalisis + 1 == TypeToken.STATIC && this.preAnalisis + 2 == TypeToken.VOID) {
            this.MAIN();
            this.METODOS();
        } else if (this.preAnalisis == TypeToken.PUBLIC || this.preAnalisis == TypeToken.PRIVATE || this.preAnalisis == TypeToken.PROTECTED) {
            this.MODIFICADOR();
            this.TIPO();
            this.emparejar(TypeToken.ID);
            this.emparejar(TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(TypeToken.PARENTESISDER);
            this.emparejar(TypeToken.LLAVEIZQ);
            this.CUERPO();
            this.emparejar(TypeToken.LLAVEDER);
            this.METODOS();
        } else {
            //epsilon
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
        }else if (this.preAnalisis == TypeToken.VOID || this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            this.TIPO();
            this.emparejar(TypeToken.ID);
            this.CUERPOINTP();
            this.CUERPOINT();
        }else{
            //Epsilon
        }
    }
    CUERPOINTP(){
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
        } else if (this.preAnalisis == TypeToken.SYSTEM && this.preAnalisis + 1 == TypeToken.PUNTO && this.preAnalisis + 2 == TypeToken.OUT) {
            this.IMPRIMIR();
            this.CUERPO();
        } else if (this.preAnalisis == TypeToken.ID) {
            this.ASIGNACION();
            this.DECLARACION();
            this.CUERPO();
        } else {
            //EPSILON
        }
    }

    //revisar el punto y coma despues de la declaracion
    SFOR() {
        this.emparejar(TypeToken.FOR);
        this.emparejar(TypeToken.PARENTESISIZQ);
        this.DECLARACION();
        this.emparejar(TypeToken.PCOMA);
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
        } else if (this.preAnalisis == TypeToken.MAYORQ && this.preAnalisis + 1 == TypeToken.ASIGNACION) {
            this.emparejar(TypeToken.MAYORQ);
            this.emparejar(TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        } else if (this.preAnalisis == TypeToken.MENORQ && this.preAnalisis + 1 == TypeToken.ASIGNACION) {
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
        } else {
            //epsilon
        }
    }

    F() {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {

        } else if (this.preAnalisis == TypeToken.NUMERO) {

        } else if (this.preAnalisis == TypeToken.GUION) {

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
    }

    DECLARACIONP() {
        if (this.preAnalisis == TypeToken.PCOMA) {
            this.emparejar(TypeToken.PCOMA);
        } else if (this.preAnalisis == TypeToken.COMA) {
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
            if (this.preAnalisis == TypeToken.NEW) {
                this.emparejar(TypeToken.NEW);
            }
            this.E();
        } else {
            //EPSILON
        }
    }
}