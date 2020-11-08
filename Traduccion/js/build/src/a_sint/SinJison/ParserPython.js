"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Token_1 = require("../../a_lex/Token");
const nodoArbol_1 = require("../../Gramatica/nodoArbol");
class Parser {
    constructor(listaTokens) {
        this.preAnalisis = -1;
        this.listaTokens = listaTokens;
        this.errorSintatico = [];
        this.pos = 0;
        this.listaRecorrido = new nodoArbol_1.Nodo_Arbol("INICIO", "");
        this.quitarComentarios();
    }
    getRecorrido() {
        return this.listaRecorrido;
    }
    emparejar(terminal, nodoArriba) {
        if (this.pos >= this.listaTokens.length) {
            return;
        }
        if (this.preAnalisis == terminal) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol(this.listaTokens[this.pos].lexema, "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
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
                this.BIGINCOI(nodoArriba);
            }
            else if (this.preAnalisis == Token_1.TypeToken.PUBLIC && this.preAnalisis + 1 == Token_1.TypeToken.INTERFACE) {
                this.BIGINCOI(nodoArriba);
            }
            else if (this.preAnalisis == Token_1.TypeToken.IF || this.preAnalisis == Token_1.TypeToken.FOR || this.preAnalisis == Token_1.TypeToken.WHILE || this.preAnalisis == Token_1.TypeToken.DO) {
                this.CUERPO(nodoArriba);
            }
            else if (this.preAnalisis == Token_1.TypeToken.ID) {
                this.METODOS(nodoArriba);
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
        let ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("ARCHIVOBIGIN", "");
        this.listaRecorrido.agregarHijo(ARCHIVOBIGIN);
        this.IMPORTBIGIN(ARCHIVOBIGIN);
        this.BIGINCOI(ARCHIVOBIGIN);
    }
    IMPORTBIGIN(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PACKAGE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPORTBIGIN", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            let ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("Package", "");
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(Token_1.TypeToken.PACKAGE, ARCHIVOBIGIN);
            let PackaBody = new nodoArbol_1.Nodo_Arbol("PackBody", "");
            IMPORTBIGIN.agregarHijo(PackaBody);
            this.PACKAGEBODY(PackaBody);
            ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "PyComa");
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, ARCHIVOBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.IMPORT) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPORTBIGIN", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            let ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("Import", "");
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(Token_1.TypeToken.IMPORT, ARCHIVOBIGIN);
            let ImpBody = new nodoArbol_1.Nodo_Arbol("ImpBody", "");
            IMPORTBIGIN.agregarHijo(ImpBody);
            this.PACKAGEBODY(ImpBody);
            ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "PyComa");
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, ARCHIVOBIGIN);
        }
        else {
            //EPSILON
        }
    }
    BIGINCOI(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("BIGINCOI", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            let ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("PUBLIC", "Public");
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(Token_1.TypeToken.PUBLIC, ARCHIVOBIGIN);
            let CI2 = new nodoArbol_1.Nodo_Arbol("CI2", "");
            IMPORTBIGIN.agregarHijo(CI2);
            this.CI2(CI2);
        }
    }
    CI2(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.CLASS) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CLASS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CLASSBIGIN(IMPORTBIGIN);
            this.BIGINCOI(nodoArriba);
        }
        else if (this.preAnalisis == Token_1.TypeToken.INTERFACE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("INTERFACE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.INTERFACEBIGIN(IMPORTBIGIN);
            this.BIGINCOI(nodoArriba);
        }
        else {
            //EPSILON
        }
    }
    CLASSBIGIN(nodoArriba) {
        let ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("Class", "class");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.CLASS, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "ID");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.ID, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("LlavIzq", "LlavIzq");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("METODOS", "");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.METODOS(ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("LlavDer", "LlavDer");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEDER, ARCHIVOBIGIN);
        this.BIGINCOI(nodoArriba);
    }
    INTERFACEBIGIN(nodoArriba) {
        let ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("Interface", "class");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.INTERFACE, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "ID");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.ID, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("LlavIzq", "LlavIzq");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("METODOS", "");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.CUERPOINT(ARCHIVOBIGIN);
        ARCHIVOBIGIN = new nodoArbol_1.Nodo_Arbol("LlavDer", "LlavDer");
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEDER, ARCHIVOBIGIN);
        this.BIGINCOI(nodoArriba);
    }
    MAIN(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Public", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PUBLIC, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Static", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.STATIC, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Void", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.VOID, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TIPO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.TIPO(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CorchIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.CORCHETEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CorchDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.CORCHETEDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEDER, IMPORTBIGIN);
    }
    IMPRIMIR(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("System", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.SYSTEM, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Punto", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PUNTO, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Out", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.OUT, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Punto", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PUNTO, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PRINTTYPE", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.PRINTTYPE(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUE", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.IMPCUE(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
    }
    PRINTTYPE(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PRINTLN) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PRINTLN", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PRINTLN, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PRINT) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PRINT", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PRINT, IMPORTBIGIN);
        }
    }
    IMPCUE(nodoArriba) {
        //Probar cadenas vacias
        if (this.preAnalisis == Token_1.TypeToken.COMILLAS) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Comillas", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUEP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Comillas", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.COMILLASIMPLE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ComillaS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUEP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ComillaS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.NUMERO || this.preAnalisis == Token_1.TypeToken.MAS || this.preAnalisis == Token_1.TypeToken.GUION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        }
        else {
            //EPSILON
        }
    }
    IMPCUEP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.CADENA) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CADENA", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.CADENA, IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    METODOS(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.STATIC && this.listaTokens[this.pos + 2].token == Token_1.TypeToken.VOID) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MAIN", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.MAIN(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("METODOS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PUBLIC || this.preAnalisis == Token_1.TypeToken.PRIVATE || this.preAnalisis == Token_1.TypeToken.PROTECTED) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MODIFICADOR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.MODIFICADOR(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TIPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("METODOSP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOSP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACION(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("METODOS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    METODOSP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PARAMETROS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.LLAVEIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.LLAVEDER, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("METODOS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PCOMA) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("METODOS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        }
        else {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACIONP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACIONP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("METODOS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        }
    }
    CUERPOINT(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC || this.preAnalisis == Token_1.TypeToken.PRIVATE || this.preAnalisis == Token_1.TypeToken.PROTECTED) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MODIFICADOR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.MODIFICADOR(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TIPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PARAMETROS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPOINT", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPOINT(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.VOID || this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TIPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPOINTP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPOINTP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPOINT", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPOINT(IMPORTBIGIN);
        }
        else {
            //Epsilon
        }
    }
    CUERPOINTP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PARAMETROS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Asignacion", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
        }
    }
    PARAMETROS(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.VOID || this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TIPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PRPR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PRPR(IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    PRPR(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.COMA) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Coma", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMA, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PARAMETROS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
        }
        else {
            //Epsilon
        }
    }
    CUERPO(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.IF) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("SIF", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SIF(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.FOR) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("SFOR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SFOR(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.WHILE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("SWHILE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SWHILE(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.DO) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("SDOWHILE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SDOWHILE(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.STRING || this.preAnalisis == Token_1.TypeToken.INT || this.preAnalisis == Token_1.TypeToken.CHAR || this.preAnalisis == Token_1.TypeToken.BOOLEAN || this.preAnalisis == Token_1.TypeToken.FLOAT || this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACION(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.SYSTEM && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.PUNTO && this.listaTokens[this.pos + 2].token == Token_1.TypeToken.OUT) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPRIMIR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPRIMIR(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            if (this.listaTokens[this.pos + 1].token == Token_1.TypeToken.PARENTESISIZQ) {
                let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LLMETOD", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.LLMETOD(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.CUERPO(IMPORTBIGIN);
            }
            else if (this.listaTokens[this.pos + 1].token == Token_1.TypeToken.MAS || this.listaTokens[this.pos + 1].token == Token_1.TypeToken.GUION) {
                let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.ASIGNACION(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACION", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.DECLARACION(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.CUERPO(IMPORTBIGIN);
            }
            else {
                let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.ASIGNACION(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACION", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.DECLARACION(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.CUERPO(IMPORTBIGIN);
            }
        }
        else if (this.preAnalisis == Token_1.TypeToken.RETURN) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Return", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.RETURN, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("RETURNCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.CONTINUE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Continue", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.CONTINUE, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.BREAK) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Break", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.BREAK, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
        }
        else {
            //EPSILON
        }
    }
    LLMETOD(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACIONP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACIONP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
        }
    }
    RETURNCUE(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.COMILLAS) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Comillas", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUEP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Comillas", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("RETURNCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.COMILLASIMPLE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ComillaS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUEP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ComillaS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("RETURNCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("RETURNCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.NUMERO || this.preAnalisis == Token_1.TypeToken.MAS || this.preAnalisis == Token_1.TypeToken.GUION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("RETURNCUE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    //revisar el punto y coma despues de la declaracion
    SFOR(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("FOR", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.FOR, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACION", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.DECLARACION(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEDER, IMPORTBIGIN);
    }
    SWHILE(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("WHILE", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.WHILE, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEDER, IMPORTBIGIN);
    }
    SDOWHILE(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.DO, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("WHILE", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.WHILE, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
    }
    SIF(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IF", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.IF, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveIzq", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveDer", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.LLAVEDER, IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ELSE", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.ELSE(IMPORTBIGIN);
    }
    ELSE(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.ELSE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ELSE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ELSE, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ELSE2", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ELSE2(IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    ELSE2(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.IF) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("SIF", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SIF(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.LLAVEIZQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.LLAVEIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CUERPO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("LlaveDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.LLAVEDER, IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    EXP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.ADMIRACION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ADMIRAICON", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ADMIRACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXPP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXPP(IMPORTBIGIN);
        }
        else {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXPP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXPP(IMPORTBIGIN);
        }
    }
    EXPP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.AND) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("AND", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.AND, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("AND", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.AND, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.OR) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("OR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.OR, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("OR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.OR, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.XOR) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("XOR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.XOR, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.MAYORQ && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MAYORQ", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.MAYORQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.MENORQ && this.listaTokens[this.pos + 1].token == Token_1.TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MENORQ", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.MENORQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.MAYORQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MAYORQ", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.MAYORQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.MENORQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MENORQ", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.MENORQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MAYORQ", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ADMIRACION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ADMIRACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ADMIRACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EXP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
    }
    E(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("T", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.T(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EP(IMPORTBIGIN);
    }
    EP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.MAS) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MAS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.MAS, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("T", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.T(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.GUION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Menos", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.GUION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("T", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.T(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("EP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EP(IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    T(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("F", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.F(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.TP(IMPORTBIGIN);
    }
    TP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.ASTERISCO) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASTERISCO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASTERISCO, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("F", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TP(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.DIAGONAL) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DIAGONAL", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.DIAGONAL, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("F", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TP(IMPORTBIGIN);
            //Agregar punto para probar
        }
        else if (this.preAnalisis == Token_1.TypeToken.PUNTO) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Punto", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PUNTO, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("F", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TP(IMPORTBIGIN);
        }
        else {
            //epsilon
        }
    }
    F(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.NUMERO) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("NUMERO", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.NUMERO, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.GUION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("MENOS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.GUION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("F", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.TRUE || this.preAnalisis == Token_1.TypeToken.FALSE) {
            if (this.preAnalisis == Token_1.TypeToken.TRUE) {
                let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TRUE", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(Token_1.TypeToken.TRUE, IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            }
            else {
                let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("FALSE", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(Token_1.TypeToken.FALSE, IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            }
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.COMILLAS || this.preAnalisis == Token_1.TypeToken.COMILLASIMPLE) {
            if (this.preAnalisis == Token_1.TypeToken.COMILLAS) {
                let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Comillas", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(Token_1.TypeToken.COMILLAS, IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUEP", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.IMPCUEP(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("Comillas", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(Token_1.TypeToken.COMILLAS, IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            }
            else {
                let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ComillaS", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(Token_1.TypeToken.COMILLASIMPLE, IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("IMPCUEP", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.IMPCUEP(IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ComillaS", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(Token_1.TypeToken.COMILLASIMPLE, IMPORTBIGIN);
                IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            }
        }
        else {
            //nada
        }
    }
    TIPO(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.VOID) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("VOID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.VOID, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.STRING) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("STRING", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.STRING, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.INT) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("INT", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.INT, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.CHAR) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CHAR", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.CHAR, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.BOOLEAN) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("BOOLEAN", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.BOOLEAN, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.FLOAT) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("FLOAT", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.FLOAT, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.DOUBLE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DOUBLE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.DOUBLE, IMPORTBIGIN);
        }
    }
    MODIFICADOR(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PUBLIC) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PUBLIC", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PUBLIC, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PRIVATE) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PRIVATE", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PRIVATE, IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.PROTECTED) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PROTECTED", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PROTECTED, IMPORTBIGIN);
        }
        else {
            //EPSILON
        }
    }
    PACKAGEBODY(nodoArriba) {
        let ImpBody = new nodoArbol_1.Nodo_Arbol("ImpBody", "");
        nodoArriba.agregarHijo(ImpBody);
        this.emparejar(Token_1.TypeToken.ID, ImpBody);
        let pp = new nodoArbol_1.Nodo_Arbol("PP", "");
        nodoArriba.agregarHijo(pp);
        this.PP(pp);
        ImpBody = new nodoArbol_1.Nodo_Arbol("PyComa", "");
        nodoArriba.agregarHijo(ImpBody);
        this.emparejar(Token_1.TypeToken.PCOMA, ImpBody);
    }
    PP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.PUNTO) {
            let ImpBody = new nodoArbol_1.Nodo_Arbol(".", "Punto");
            nodoArriba.agregarHijo(ImpBody);
            this.emparejar(Token_1.TypeToken.PUNTO, ImpBody);
            let pp = new nodoArbol_1.Nodo_Arbol("PP", "");
            nodoArriba.agregarHijo(pp);
            this.PP(pp);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASTERISCO) {
            let ImpBody = new nodoArbol_1.Nodo_Arbol("*", "Asterisco");
            nodoArriba.agregarHijo(ImpBody);
            this.emparejar(Token_1.TypeToken.ASTERISCO, ImpBody);
            let pp = new nodoArbol_1.Nodo_Arbol("PP", "");
            nodoArriba.agregarHijo(pp);
            this.PP(pp);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ID) {
            let ImpBody = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(ImpBody);
            this.emparejar(Token_1.TypeToken.ID, ImpBody);
            let pp = new nodoArbol_1.Nodo_Arbol("PP", "");
            nodoArriba.agregarHijo(pp);
            this.PP(pp);
        }
        else {
            //EPSILON
        }
    }
    DECLARACION(nodoArriba) {
        let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("TIPO", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.TIPO(IMPORTBIGIN);
        if (this.preAnalisis == Token_1.TypeToken.CORCHETEIZQ) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CorchIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.CORCHETEIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("CorchDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.CORCHETEDER, IMPORTBIGIN);
        }
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.ASIGNACION(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACIONP", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.DECLARACIONP(IMPORTBIGIN);
        IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
    }
    DECLARACIONP(nodoArriba) {
        //if (this.preAnalisis == TypeToken.PCOMA) {
        // this.emparejar(TypeToken.PCOMA);
        //} else 
        if (this.preAnalisis == Token_1.TypeToken.COMA) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("COMA", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.COMA, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("DECLARACIONP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACIONP(IMPORTBIGIN);
        }
        else {
            //EPSILON
        }
    }
    ASIGNACION(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.ID) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
        }
        else if (this.preAnalisis == Token_1.TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGP", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGP(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("E", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
        }
        //else if (this.preAnalisis==TypeToken.PCOMA) {
        //   this.emparejar(TypeToken.PCOMA);
        //}
        else {
            //EPSILON
        }
    }
    ASIGP(nodoArriba) {
        if (this.preAnalisis == Token_1.TypeToken.NEW) {
            let IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("NEW", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.NEW, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ID", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenIzq", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PARAMETROS", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ParenDer", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("PyComa", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(Token_1.TypeToken.PCOMA, IMPORTBIGIN);
            IMPORTBIGIN = new nodoArbol_1.Nodo_Arbol("ASIGNACION", "");
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
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
