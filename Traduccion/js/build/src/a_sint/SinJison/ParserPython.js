"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Token_1 = require("../../a_lex/Token");
class Parser {
    constructor(listaTokens) {
        this.preAnalisis = -1;
        this.listaTokens = listaTokens;
        this.errorSintatico = [];
        this.pos = 0;
        this.quitarComentarios();
    }
    emparejar(terminal) {
        if (this.pos >= this.listaTokens.length) {
            return;
        }
        if (this.preAnalisis == terminal) {
            console.log("token correcto; " + this.listaTokens[this.pos].token);
            this.pos++;
            if (this.pos < this.listaTokens.length) {
                this.preAnalisis = this.listaTokens[this.pos].token;
            }
        }
        else {
            console.log("Se encontro error sintactico, no se esperaba: " + this.preAnalisis.toString() + " val:" + this.listaTokens[this.pos].lexema);
            this.errorSintatico.push("error sintactico no se esperaba: " + this.preAnalisis.toString() + " val:" + this.listaTokens[this.pos].lexema);
            //RECUPERACION DE ERRORES
            while (this.pos < this.listaTokens.length) {
                //console.log(this.lista_Tokens[this.pos].token+" == "+TypeToken.T_PYCOMA)  
                if (this.listaTokens[this.pos].token == Token_1.TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.CLASS) {
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                }
                else if (this.listaTokens[this.pos].token == Token_1.TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.INTERFACE) {
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                }
                else if (this.listaTokens[this.pos].token == Token_1.TypeToken.IF || this.listaTokens[this.pos].token == Token_1.TypeToken.FOR || this.listaTokens[this.pos].token == Token_1.TypeToken.WHILE || this.listaTokens[this.pos].token == Token_1.TypeToken.DO) {
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                }
                else if (this.listaTokens[this.pos].token == Token_1.TypeToken.PCOMA
                    || this.listaTokens[this.pos].token == Token_1.TypeToken.LLAVEDER) {
                    this.pos++;
                    this.preAnalisis = this.listaTokens[this.pos].token;
                    break;
                }
                this.pos++;
            }
            if (this.preAnalisis == Token_1.TypeToken.PUBLIC && this.preAnalisis + 1 == Token_1.TypeToken.CLASS) {
                this.BIGINCOI();
            }
            else if (this.preAnalisis == Token_1.TypeToken.PUBLIC && this.preAnalisis + 1 == Token_1.TypeToken.INTERFACE) {
                this.BIGINCOI();
            }
            else if (this.preAnalisis == Token_1.TypeToken.IF || this.preAnalisis == Token_1.TypeToken.FOR || this.preAnalisis == Token_1.TypeToken.WHILE || this.preAnalisis == Token_1.TypeToken.DO) {
                this.CUERPO();
            }
            else if (this.preAnalisis == Token_1.TypeToken.ID) {
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
        if (this.preAnalisis == Token_1.TypeToken.PACKAGE) {
            this.emparejar(Token_1.TypeToken.PACKAGE);
            this.PACKAGEBODY();
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
        else if (this.preAnalisis == Token_1.TypeToken.IMPORT) {
            this.emparejar(Token_1.TypeToken.IMPORT);
            this.PACKAGEBODY();
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
        else {
            //EPSILON
        }
    }
    BIGINCOI() {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC) {
            this.emparejar(Token_1.TypeToken.PUBLIC);
            this.CI2();
        }
    }
    CI2() {
        if (this.preAnalisis == Token_1.TypeToken.CLASS) {
            this.CLASSBIGIN();
            this.BIGINCOI();
        }
        else if (this.preAnalisis == Token_1.TypeToken.INTERFACE) {
            this.INTERFACEBIGIN();
            this.BIGINCOI();
        }
        else {
            //EPSILON
        }
    }
    CLASSBIGIN() {
        this.emparejar(Token_1.TypeToken.CLASS);
        this.emparejar(Token_1.TypeToken.ID);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ);
        this.METODOS();
        this.emparejar(Token_1.TypeToken.LLAVEDER);
        this.BIGINCOI();
    }
    INTERFACEBIGIN() {
        this.emparejar(Token_1.TypeToken.INTERFACE);
        this.emparejar(Token_1.TypeToken.ID);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ);
        this.CUERPOINT();
        this.emparejar(Token_1.TypeToken.LLAVEDER);
        this.BIGINCOI();
    }
    MAIN() {
        this.emparejar(Token_1.TypeToken.PUBLIC);
        this.emparejar(Token_1.TypeToken.STATIC);
        this.emparejar(Token_1.TypeToken.VOID);
        this.emparejar(Token_1.TypeToken.ID);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
        this.TIPO();
        this.emparejar(Token_1.TypeToken.CORCHETEIZQ);
        this.emparejar(Token_1.TypeToken.CORCHETEDER);
        this.emparejar(Token_1.TypeToken.ID);
        this.emparejar(Token_1.TypeToken.PARENTESISDER);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(Token_1.TypeToken.LLAVEDER);
    }
    IMPRIMIR() {
        this.emparejar(Token_1.TypeToken.SYSTEM);
        this.emparejar(Token_1.TypeToken.PUNTO);
        this.emparejar(Token_1.TypeToken.OUT);
        this.emparejar(Token_1.TypeToken.PUNTO);
        this.PRINTTYPE();
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
        this.IMPCUE();
        this.emparejar(Token_1.TypeToken.PARENTESISDER);
        this.emparejar(Token_1.TypeToken.PCOMA);
    }
    PRINTTYPE() {
        if (this.preAnalisis == Token_1.TypeToken.PRINTLN) {
            this.emparejar(Token_1.TypeToken.PRINTLN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PRINT) {
            this.emparejar(Token_1.TypeToken.PRINT);
        }
    }
    IMPCUE() {
        //Probar cadenas vacias
        if (this.preAnalisis == Token_1.TypeToken.COMILLAS) {
            this.emparejar(Token_1.TypeToken.COMILLAS);
            this.IMPCUEP();
            this.emparejar(Token_1.TypeToken.COMILLAS);
            this.IMPCUE();
        }
        else if (this.preAnalisis == Token_1.TypeToken.COMILLASIMPLE) {
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE);
            this.IMPCUEP();
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE);
            this.IMPCUE();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            this.emparejar(Token_1.TypeToken.ID);
            this.IMPCUE();
        }
        else if (this.preAnalisis == Token_1.TypeToken.NUMERO || this.preAnalisis == Token_1.TypeToken.MAS || this.preAnalisis == Token_1.TypeToken.GUION) {
            this.E();
            this.IMPCUE();
        }
        else {
            //EPSILON
        }
    }
    IMPCUEP() {
        if (this.preAnalisis == Token_1.TypeToken.CADENA) {
            this.emparejar(Token_1.TypeToken.CADENA);
        }
        else {
            //epsilon
        }
    }
    METODOS() {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.STATIC && this.listaTokens[this.pos + 2].token == Token_1.TypeToken.VOID) {
            this.MAIN();
            this.METODOS();
        }
        else if (this.preAnalisis == Token_1.TypeToken.PUBLIC || this.preAnalisis == Token_1.TypeToken.PRIVATE || this.preAnalisis == Token_1.TypeToken.PROTECTED) {
            this.MODIFICADOR();
            this.TIPO();
            this.emparejar(Token_1.TypeToken.ID);
            this.METODOSP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            this.DECLARACION();
            this.METODOS();
        }
        else {
            //epsilon
        }
    }
    METODOSP() {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(Token_1.TypeToken.PARENTESISDER);
            this.emparejar(Token_1.TypeToken.LLAVEIZQ);
            this.CUERPO();
            this.emparejar(Token_1.TypeToken.LLAVEDER);
            this.METODOS();
        }
        else if (this.preAnalisis == Token_1.TypeToken.PCOMA) {
            this.emparejar(Token_1.TypeToken.PCOMA);
            this.METODOS();
        }
        else {
            this.DECLARACIONP();
            this.METODOS();
        }
    }
    CUERPOINT() {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC || this.preAnalisis == Token_1.TypeToken.PRIVATE || this.preAnalisis == Token_1.TypeToken.PROTECTED) {
            this.MODIFICADOR();
            this.TIPO();
            this.emparejar(Token_1.TypeToken.ID);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(Token_1.TypeToken.PARENTESISDER);
            this.emparejar(Token_1.TypeToken.PCOMA);
            this.CUERPOINT();
        }
        else if (this.preAnalisis == Token_1.TypeToken.VOID || this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            this.TIPO();
            this.emparejar(Token_1.TypeToken.ID);
            this.CUERPOINTP();
            this.CUERPOINT();
        }
        else {
            //Epsilon
        }
    }
    CUERPOINTP() {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(Token_1.TypeToken.PARENTESISDER);
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASIGNACION) {
            this.emparejar(Token_1.TypeToken.ASIGNACION);
            this.E();
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
    }
    PARAMETROS() {
        if (this.preAnalisis == Token_1.TypeToken.VOID || this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            this.TIPO();
            this.emparejar(Token_1.TypeToken.ID);
            this.PRPR();
        }
        else {
            //epsilon
        }
    }
    PRPR() {
        if (this.preAnalisis == Token_1.TypeToken.COMA) {
            this.emparejar(Token_1.TypeToken.COMA);
            this.PARAMETROS();
        }
        else {
            //Epsilon
        }
    }
    CUERPO() {
        if (this.preAnalisis == Token_1.TypeToken.IF) {
            this.SIF();
            this.CUERPO();
        }
        else if (this.preAnalisis == Token_1.TypeToken.FOR) {
            this.SFOR();
            this.CUERPO();
        }
        else if (this.preAnalisis == Token_1.TypeToken.WHILE) {
            this.SWHILE();
            this.CUERPO();
        }
        else if (this.preAnalisis == Token_1.TypeToken.DO) {
            this.SDOWHILE();
            this.CUERPO();
        }
        else if (this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            this.DECLARACION();
            this.CUERPO();
        }
        else if (this.preAnalisis == Token_1.TypeToken.SYSTEM && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.PUNTO && this.listaTokens[this.pos + 2].token == Token_1.TypeToken.OUT) {
            this.IMPRIMIR();
            this.CUERPO();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            if (this.listaTokens[this.pos + 1].token == Token_1.TypeToken.PARENTESISIZQ) {
                this.emparejar(Token_1.TypeToken.ID);
                this.LLMETOD();
                this.CUERPO();
            }
            else if (this.listaTokens[this.pos + 1].token == Token_1.TypeToken.MAS || this.listaTokens[this.pos + 1].token == Token_1.TypeToken.GUION) {
                this.E();
                this.ASIGNACION();
                this.DECLARACION();
                this.CUERPO();
            }
            else {
                this.ASIGNACION();
                this.DECLARACION();
                this.CUERPO();
            }
        }
        else if (this.preAnalisis == Token_1.TypeToken.RETURN) {
            this.emparejar(Token_1.TypeToken.RETURN);
            this.RETURNCUE();
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
        else if (this.preAnalisis == Token_1.TypeToken.CONTINUE) {
            this.emparejar(Token_1.TypeToken.CONTINUE);
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
        else if (this.preAnalisis == Token_1.TypeToken.BREAK) {
            this.emparejar(Token_1.TypeToken.BREAK);
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
        else {
            //EPSILON
        }
    }
    LLMETOD() {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
            this.ASIGNACION();
            this.DECLARACIONP();
            this.emparejar(Token_1.TypeToken.PARENTESISDER);
            this.emparejar(Token_1.TypeToken.PCOMA);
        }
    }
    RETURNCUE() {
        if (this.preAnalisis == Token_1.TypeToken.COMILLAS) {
            this.emparejar(Token_1.TypeToken.COMILLAS);
            this.IMPCUEP();
            this.emparejar(Token_1.TypeToken.COMILLAS);
            this.RETURNCUE();
        }
        else if (this.preAnalisis == Token_1.TypeToken.COMILLASIMPLE) {
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE);
            this.IMPCUEP();
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE);
            this.RETURNCUE();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            this.emparejar(Token_1.TypeToken.ID);
            this.RETURNCUE();
        }
        else if (this.preAnalisis == Token_1.TypeToken.NUMERO || this.preAnalisis == Token_1.TypeToken.MAS || this.preAnalisis == Token_1.TypeToken.GUION) {
            this.E();
            this.RETURNCUE();
        }
        else {
            //epsilon
        }
    }
    //revisar el punto y coma despues de la declaracion
    SFOR() {
        this.emparejar(Token_1.TypeToken.FOR);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
        this.DECLARACION();
        this.EXP();
        this.emparejar(Token_1.TypeToken.PCOMA);
        this.EXP();
        this.emparejar(Token_1.TypeToken.PARENTESISDER);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(Token_1.TypeToken.LLAVEDER);
    }
    SWHILE() {
        this.emparejar(Token_1.TypeToken.WHILE);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
        this.EXP();
        this.emparejar(Token_1.TypeToken.PARENTESISDER);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(Token_1.TypeToken.LLAVEDER);
    }
    SDOWHILE() {
        this.emparejar(Token_1.TypeToken.DO);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(Token_1.TypeToken.LLAVEDER);
        this.emparejar(Token_1.TypeToken.WHILE);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
        this.EXP();
        this.emparejar(Token_1.TypeToken.PARENTESISDER);
        this.emparejar(Token_1.TypeToken.PCOMA);
    }
    SIF() {
        this.emparejar(Token_1.TypeToken.IF);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
        this.EXP();
        this.emparejar(Token_1.TypeToken.PARENTESISDER);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ);
        this.CUERPO();
        this.emparejar(Token_1.TypeToken.LLAVEDER);
        this.ELSE();
    }
    ELSE() {
        if (this.preAnalisis == Token_1.TypeToken.ELSE) {
            this.emparejar(Token_1.TypeToken.ELSE);
            this.ELSE2();
        }
        else {
            //epsilon
        }
    }
    ELSE2() {
        if (this.preAnalisis == Token_1.TypeToken.IF) {
            this.SIF();
        }
        else if (this.preAnalisis == Token_1.TypeToken.LLAVEIZQ) {
            this.emparejar(Token_1.TypeToken.LLAVEIZQ);
            this.CUERPO();
            this.emparejar(Token_1.TypeToken.LLAVEDER);
        }
        else {
            //epsilon
        }
    }
    EXP() {
        if (this.preAnalisis == Token_1.TypeToken.ADMIRACION) {
            this.emparejar(Token_1.TypeToken.ADMIRACION);
            this.E();
            this.EXPP();
        }
        else {
            this.E();
            this.EXPP();
        }
    }
    EXPP() {
        if (this.preAnalisis == Token_1.TypeToken.AND) {
            this.emparejar(Token_1.TypeToken.AND);
            this.emparejar(Token_1.TypeToken.AND);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.OR) {
            this.emparejar(Token_1.TypeToken.OR);
            this.emparejar(Token_1.TypeToken.OR);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.XOR) {
            this.emparejar(Token_1.TypeToken.XOR);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.MAYORQ && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.ASIGNACION) {
            this.emparejar(Token_1.TypeToken.MAYORQ);
            this.emparejar(Token_1.TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.MENORQ && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.ASIGNACION) {
            this.emparejar(Token_1.TypeToken.MENORQ);
            this.emparejar(Token_1.TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.MAYORQ) {
            this.emparejar(Token_1.TypeToken.MAYORQ);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.MENORQ) {
            this.emparejar(Token_1.TypeToken.MENORQ);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASIGNACION) {
            this.emparejar(Token_1.TypeToken.ASIGNACION);
            this.emparejar(Token_1.TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ADMIRACION) {
            this.emparejar(Token_1.TypeToken.ADMIRACION);
            this.emparejar(Token_1.TypeToken.ASIGNACION);
            this.E();
            this.EXP();
        }
    }
    E() {
        this.T();
        this.EP();
    }
    EP() {
        if (this.preAnalisis == Token_1.TypeToken.MAS) {
            this.emparejar(Token_1.TypeToken.MAS);
            this.T();
            this.EP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.GUION) {
            this.emparejar(Token_1.TypeToken.GUION);
            this.T();
            this.EP();
        }
        else {
            //epsilon
        }
    }
    T() {
        this.F();
        this.TP();
    }
    TP() {
        if (this.preAnalisis == Token_1.TypeToken.ASTERISCO) {
            this.emparejar(Token_1.TypeToken.ASTERISCO);
            this.F();
            this.TP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.DIAGONAL) {
            this.emparejar(Token_1.TypeToken.DIAGONAL);
            this.F();
            this.TP();
            //Agregar punto para probar
        }
        else if (this.preAnalisis == Token_1.TypeToken.PUNTO) {
            this.emparejar(Token_1.TypeToken.PUNTO);
            this.F();
            this.TP();
        }
        else {
            //epsilon
        }
    }
    F() {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
            this.E();
            this.emparejar(Token_1.TypeToken.PARENTESISDER);
        }
        else if (this.preAnalisis == Token_1.TypeToken.NUMERO) {
            this.emparejar(Token_1.TypeToken.NUMERO);
            this.E();
        }
        else if (this.preAnalisis == Token_1.TypeToken.GUION) {
            this.emparejar(Token_1.TypeToken.GUION);
            this.F();
        }
        else if (this.preAnalisis == Token_1.TypeToken.TRUE || this.preAnalisis == Token_1.TypeToken.FALSE) {
            if (this.preAnalisis == Token_1.TypeToken.TRUE) {
                this.emparejar(Token_1.TypeToken.TRUE);
                this.E();
            }
            else {
                this.emparejar(Token_1.TypeToken.FALSE);
                this.E();
            }
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            this.emparejar(Token_1.TypeToken.ID);
            this.E();
        }
        else if (this.preAnalisis == Token_1.TypeToken.COMILLAS || this.preAnalisis == Token_1.TypeToken.COMILLASIMPLE) {
            if (this.preAnalisis == Token_1.TypeToken.COMILLAS) {
                this.emparejar(Token_1.TypeToken.COMILLAS);
                this.IMPCUEP();
                this.emparejar(Token_1.TypeToken.COMILLAS);
                this.E();
            }
            else {
                this.emparejar(Token_1.TypeToken.COMILLASIMPLE);
                this.IMPCUEP();
                this.emparejar(Token_1.TypeToken.COMILLASIMPLE);
                this.E();
            }
        }
        else {
            //nada
        }
    }
    TIPO() {
        if (this.preAnalisis == Token_1.TypeToken.VOID) {
            this.emparejar(Token_1.TypeToken.VOID);
        }
        else if (this.preAnalisis == Token_1.TypeToken.STRING) {
            this.emparejar(Token_1.TypeToken.STRING);
        }
        else if (this.preAnalisis == Token_1.TypeToken.INT) {
            this.emparejar(Token_1.TypeToken.INT);
        }
        else if (this.preAnalisis == Token_1.TypeToken.CHAR) {
            this.emparejar(Token_1.TypeToken.CHAR);
        }
        else if (this.preAnalisis == Token_1.TypeToken.BOOLEAN) {
            this.emparejar(Token_1.TypeToken.BOOLEAN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.FLOAT) {
            this.emparejar(Token_1.TypeToken.FLOAT);
        }
        else if (this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            this.emparejar(Token_1.TypeToken.DOUBLE);
        }
    }
    MODIFICADOR() {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC) {
            this.emparejar(Token_1.TypeToken.PUBLIC);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PRIVATE) {
            this.emparejar(Token_1.TypeToken.PRIVATE);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PROTECTED) {
            this.emparejar(Token_1.TypeToken.PROTECTED);
        }
        else {
            //EPSILON
        }
    }
    PACKAGEBODY() {
        this.emparejar(Token_1.TypeToken.ID);
        this.PP();
        this.emparejar(Token_1.TypeToken.PCOMA);
    }
    PP() {
        if (this.preAnalisis == Token_1.TypeToken.PUNTO) {
            this.emparejar(Token_1.TypeToken.PUNTO);
            this.PP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASTERISCO) {
            this.emparejar(Token_1.TypeToken.ASTERISCO);
            this.PP();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            this.emparejar(Token_1.TypeToken.ID);
            this.PP();
        }
        else {
            //EPSILON
        }
    }
    DECLARACION() {
        this.TIPO();
        if (this.preAnalisis == Token_1.TypeToken.CORCHETEIZQ) {
            this.emparejar(Token_1.TypeToken.CORCHETEIZQ);
            this.emparejar(Token_1.TypeToken.CORCHETEDER);
        }
        this.ASIGNACION();
        this.DECLARACIONP();
        this.emparejar(Token_1.TypeToken.PCOMA);
    }
    DECLARACIONP() {
        //if (this.preAnalisis == TypeToken.PCOMA) {
        // this.emparejar(TypeToken.PCOMA);
        //} else 
        if (this.preAnalisis == Token_1.TypeToken.COMA) {
            this.emparejar(Token_1.TypeToken.COMA);
            this.ASIGNACION();
            this.DECLARACIONP();
        }
        else {
            //EPSILON
        }
    }
    ASIGNACION() {
        if (this.preAnalisis == Token_1.TypeToken.ID) {
            this.emparejar(Token_1.TypeToken.ID);
            this.ASIGNACION();
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASIGNACION) {
            this.emparejar(Token_1.TypeToken.ASIGNACION);
            this.ASIGP();
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
        if (this.preAnalisis == Token_1.TypeToken.NEW) {
            this.emparejar(Token_1.TypeToken.NEW);
            this.emparejar(Token_1.TypeToken.ID);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ);
            this.PARAMETROS();
            this.emparejar(Token_1.TypeToken.PARENTESISDER);
            this.emparejar(Token_1.TypeToken.PCOMA);
            this.ASIGNACION();
        }
    }
    getListaErrores() {
        return this.errorSintatico;
    }
    quitarComentarios() {
        var auxTokens = [];
        for (let index = 0; index < this.listaTokens.length; index++) {
            if (this.listaTokens[index].token == Token_1.TypeToken.DIAGONAL) {
                if (this.listaTokens[index + 1].token == Token_1.TypeToken.DIAGONAL) {
                    index = index + 2;
                }
                else if (this.listaTokens[index + 1].token == Token_1.TypeToken.ASTERISCO) {
                    index = index + 4;
                }
                else {
                    auxTokens.push(this.listaTokens[index]);
                }
            }
            else {
                auxTokens.push(this.listaTokens[index]);
            }
        }
        this.listaTokens = auxTokens;
    }
}
exports.Parser = Parser;
