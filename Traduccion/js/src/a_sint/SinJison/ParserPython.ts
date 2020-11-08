import { Token } from "../../a_lex/Token"
import { TypeToken } from "../../a_lex/Token"
import { Tsplit } from "../../routes/manejoText";
import { Nodo_Arbol } from "../../Gramatica/nodoArbol";

export class Parser {

    listaTokens: Token[];
    errorSintatico: String[];
    preAnalisis: number;
    pos: number;

    listaRecorrido: Nodo_Arbol;

    constructor(listaTokens: Token[]) {
        this.preAnalisis = -1;
        this.listaTokens = listaTokens;
        this.errorSintatico = [];
        this.pos = 0;
        this.listaRecorrido = new Nodo_Arbol("INICIO", "");
        this.quitarComentarios();
        this.agregarUltimo();
    }

    agregarUltimo(){
        this.listaTokens.push(new Token(TypeToken.NINGUNO, ""));
    }
    getRecorrido(): Nodo_Arbol {
        return this.listaRecorrido;
    }
    emparejar(terminal: TypeToken, nodoArriba: Nodo_Arbol) {
        if (this.pos >= this.listaTokens.length) {
            return;
        }
        if (this.preAnalisis == terminal) {
            if (this.preAnalisis == TypeToken.COMILLASIMPLE || this.preAnalisis == TypeToken.COMILLAS) {
                let IMPORTBIGIN = new Nodo_Arbol("comillas", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
            } else {
                let IMPORTBIGIN = new Nodo_Arbol(this.listaTokens[this.pos].lexema, "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
            }

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
                this.BIGINCOI(nodoArriba);
            } else if (this.preAnalisis == TypeToken.PUBLIC && this.preAnalisis + 1 == TypeToken.INTERFACE) {
                this.BIGINCOI(nodoArriba);
            } else if (this.preAnalisis == TypeToken.IF || this.preAnalisis == TypeToken.FOR || this.preAnalisis == TypeToken.WHILE || this.preAnalisis == TypeToken.DO) {
                this.CUERPO(nodoArriba);

            } else
                if (this.preAnalisis == TypeToken.ID) {
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
        let ARCHIVOBIGIN = new Nodo_Arbol("ARCHIVOBIGIN", "")
        this.listaRecorrido.agregarHijo(ARCHIVOBIGIN);
        this.IMPORTBIGIN(ARCHIVOBIGIN);

        this.BIGINCOI(ARCHIVOBIGIN);
    }

    IMPORTBIGIN(nodoArriba: Nodo_Arbol) {

        if (this.preAnalisis == TypeToken.PACKAGE) {
            let IMPORTBIGIN = new Nodo_Arbol("IMPORTBIGIN", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            let ARCHIVOBIGIN = new Nodo_Arbol("Package", "")
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(TypeToken.PACKAGE, ARCHIVOBIGIN);
            let PackaBody = new Nodo_Arbol("PackBody", "")
            IMPORTBIGIN.agregarHijo(PackaBody);
            this.PACKAGEBODY(PackaBody);
            ARCHIVOBIGIN = new Nodo_Arbol("PyComa", "PyComa")
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(TypeToken.PCOMA, ARCHIVOBIGIN);


        } else if (this.preAnalisis == TypeToken.IMPORT) {
            let IMPORTBIGIN = new Nodo_Arbol("IMPORTBIGIN", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            let ARCHIVOBIGIN = new Nodo_Arbol("Import", "")
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(TypeToken.IMPORT, ARCHIVOBIGIN);
            let ImpBody = new Nodo_Arbol("ImpBody", "")
            IMPORTBIGIN.agregarHijo(ImpBody);
            this.PACKAGEBODY(ImpBody);
            ARCHIVOBIGIN = new Nodo_Arbol("PyComa", "PyComa")
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(TypeToken.PCOMA, ARCHIVOBIGIN);

        } else {
            //EPSILON
        }
    }

    BIGINCOI(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PUBLIC) {
            let IMPORTBIGIN = new Nodo_Arbol("BIGINCOI", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            let ARCHIVOBIGIN = new Nodo_Arbol("PUBLIC", "Public")
            IMPORTBIGIN.agregarHijo(ARCHIVOBIGIN);
            this.emparejar(TypeToken.PUBLIC, ARCHIVOBIGIN);
            let CI2 = new Nodo_Arbol("CI2", "")
            IMPORTBIGIN.agregarHijo(CI2);
            this.CI2(CI2);
        }
    }

    CI2(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.CLASS) {
            let IMPORTBIGIN = new Nodo_Arbol("CLASS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CLASSBIGIN(IMPORTBIGIN);

            this.BIGINCOI(nodoArriba);
        } else if (this.preAnalisis == TypeToken.INTERFACE) {
            let IMPORTBIGIN = new Nodo_Arbol("INTERFACE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.INTERFACEBIGIN(IMPORTBIGIN);
            this.BIGINCOI(nodoArriba);
        } else {
            //EPSILON
        }

    }

    CLASSBIGIN(nodoArriba: Nodo_Arbol) {
        let ARCHIVOBIGIN = new Nodo_Arbol("Class", "class")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.CLASS, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("ID", "ID")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.ID, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("LlavIzq", "LlavIzq")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.LLAVEIZQ, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("METODOS", "")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.METODOS(ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("LlavDer", "LlavDer")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.LLAVEDER, ARCHIVOBIGIN);
        this.BIGINCOI(nodoArriba);
    }

    INTERFACEBIGIN(nodoArriba: Nodo_Arbol) {
        let ARCHIVOBIGIN = new Nodo_Arbol("Interface", "class")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.INTERFACE, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("ID", "ID")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.ID, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("LlavIzq", "LlavIzq")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.LLAVEIZQ, ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("METODOS", "")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.CUERPOINT(ARCHIVOBIGIN);
        ARCHIVOBIGIN = new Nodo_Arbol("LlavDer", "LlavDer")
        nodoArriba.agregarHijo(ARCHIVOBIGIN);
        this.emparejar(TypeToken.LLAVEDER, ARCHIVOBIGIN);
        this.BIGINCOI(nodoArriba);
    }

    MAIN(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("Public", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PUBLIC, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("Static", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.STATIC, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("Void", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.VOID, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ID", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.ID, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("TIPO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.TIPO(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("CorchIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.CORCHETEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("CorchDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.CORCHETEDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ID", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.ID, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEDER, IMPORTBIGIN);
    }

    IMPRIMIR(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("System", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.SYSTEM, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("Punto", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PUNTO, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("Out", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.OUT, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("Punto", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PUNTO, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("PRINTTYPE", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.PRINTTYPE(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("IMPCUE", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.IMPCUE(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
    }

    PRINTTYPE(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PRINTLN) {
            let IMPORTBIGIN = new Nodo_Arbol("PRINTLN", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PRINTLN, IMPORTBIGIN)
        } else if (this.preAnalisis == TypeToken.PRINT) {
            let IMPORTBIGIN = new Nodo_Arbol("PRINT", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PRINT, IMPORTBIGIN)
        }
    }

    IMPCUE(nodoArriba: Nodo_Arbol) {
        //Probar cadenas vacias
        if (this.preAnalisis == TypeToken.COMILLAS) {
            let IMPORTBIGIN = new Nodo_Arbol("Comillas", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUEP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("Comillas", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.COMILLASIMPLE) {
            let IMPORTBIGIN = new Nodo_Arbol("ComillaS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUEP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ComillaS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.ID) {
            let IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.NUMERO || this.preAnalisis == TypeToken.MAS || this.preAnalisis == TypeToken.GUION) {
            let IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUE(IMPORTBIGIN);
        } else {

            //EPSILON
        }
    }
    IMPCUEP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.CADENA) {
            let IMPORTBIGIN = new Nodo_Arbol("CADENA", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.CADENA, IMPORTBIGIN);
        } else {
            //epsilon
        }
    }

    METODOS(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PUBLIC && this.listaTokens[this.pos + 1].token == TypeToken.STATIC && this.listaTokens[this.pos + 2].token == TypeToken.VOID) {
            let IMPORTBIGIN = new Nodo_Arbol("MAIN", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.MAIN(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("METODOS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.PUBLIC || this.preAnalisis == TypeToken.PRIVATE || this.preAnalisis == TypeToken.PROTECTED) {
            let IMPORTBIGIN = new Nodo_Arbol("MODIFICADOR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.MODIFICADOR(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("TIPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("METODOSP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOSP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            /*let IMPORTBIGIN = new Nodo_Arbol("DECLARACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACION(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("METODOS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);*/

            let IMPORTBIGIN = new Nodo_Arbol("TIPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("METODOSP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOSP(IMPORTBIGIN);
        } else {
            //epsilon
        }

    }
    METODOSP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PARAMETROS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("LlaveIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.LLAVEIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("LlaveDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.LLAVEDER, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("METODOS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.PCOMA) {
            let IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("METODOS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        }
        else {
            let IMPORTBIGIN = new Nodo_Arbol("DECLARACIONP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACIONP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("METODOS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOS(IMPORTBIGIN);
        }
    }

    CUERPOINT(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PUBLIC || this.preAnalisis == TypeToken.PRIVATE || this.preAnalisis == TypeToken.PROTECTED) {
            let IMPORTBIGIN = new Nodo_Arbol("MODIFICADOR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.MODIFICADOR(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("TIPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PARAMETROS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPOINT", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPOINT(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.VOID || this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            let IMPORTBIGIN = new Nodo_Arbol("TIPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPOINTP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPOINTP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPOINT", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPOINT(IMPORTBIGIN);
        } else {
            //Epsilon
        }
    }
    CUERPOINTP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PARAMETROS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new Nodo_Arbol("Asignacion", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
        }
    }

    PARAMETROS(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.VOID || this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            let IMPORTBIGIN = new Nodo_Arbol("TIPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TIPO(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PRPR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PRPR(IMPORTBIGIN);
        } else {
            //epsilon
        }
    }
    PRPR(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.COMA) {
            let IMPORTBIGIN = new Nodo_Arbol("Coma", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMA, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PARAMETROS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
        } else {
            //Epsilon
        }
    }

    CUERPO(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.IF) {
            let IMPORTBIGIN = new Nodo_Arbol("SIF", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SIF(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.FOR) {
            let IMPORTBIGIN = new Nodo_Arbol("SFOR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SFOR(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.WHILE) {
            let IMPORTBIGIN = new Nodo_Arbol("SWHILE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SWHILE(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.DO) {
            let IMPORTBIGIN = new Nodo_Arbol("SDOWHILE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SDOWHILE(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.STRING || this.preAnalisis == TypeToken.INT || this.preAnalisis == TypeToken.CHAR || this.preAnalisis == TypeToken.BOOLEAN || this.preAnalisis == TypeToken.FLOAT || this.preAnalisis == TypeToken.DOUBLE) {
            let IMPORTBIGIN = new Nodo_Arbol("DECLARACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACION(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.SYSTEM && this.listaTokens[this.pos + 1].token == TypeToken.PUNTO && this.listaTokens[this.pos + 2].token == TypeToken.OUT) {
            let IMPORTBIGIN = new Nodo_Arbol("IMPRIMIR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPRIMIR(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.ID) {
            if (this.listaTokens[this.pos + 1].token == TypeToken.PARENTESISIZQ) {
                let IMPORTBIGIN = new Nodo_Arbol("ID", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(TypeToken.ID, IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("LLMETOD", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.LLMETOD(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.CUERPO(IMPORTBIGIN);
            } else if (this.listaTokens[this.pos + 1].token == TypeToken.MAS || this.listaTokens[this.pos + 1].token == TypeToken.GUION) {
                let IMPORTBIGIN = new Nodo_Arbol("E", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.ASIGNACION(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("DECLARACION", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.DECLARACION(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.CUERPO(IMPORTBIGIN);
            } else {
                let IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.ASIGNACION(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("DECLARACION", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.DECLARACION(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.CUERPO(IMPORTBIGIN);
            }


        } else if (this.preAnalisis == TypeToken.RETURN) {
            let IMPORTBIGIN = new Nodo_Arbol("Return", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.RETURN, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("RETURNCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.CONTINUE) {
            let IMPORTBIGIN = new Nodo_Arbol("Continue", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.CONTINUE, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.BREAK) {
            let IMPORTBIGIN = new Nodo_Arbol("Break", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.BREAK, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
        } else {
            //EPSILON
        }
    }
    LLMETOD(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("DECLARACIONP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACIONP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
        }
    }
    RETURNCUE(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.COMILLAS) {
            let IMPORTBIGIN = new Nodo_Arbol("Comillas", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUEP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("Comillas", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLAS, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("RETURNCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.COMILLASIMPLE) {
            let IMPORTBIGIN = new Nodo_Arbol("ComillaS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("IMPCUEP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.IMPCUEP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ComillaS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMILLASIMPLE, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("RETURNCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.ID) {
            let IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("RETURNCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("RETURNCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN);
        }
        else if (this.preAnalisis == TypeToken.NUMERO || this.preAnalisis == TypeToken.MAS || this.preAnalisis == TypeToken.GUION || this.preAnalisis == TypeToken.ASTERISCO || this.preAnalisis == TypeToken.DIAGONAL) {
            let IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("RETURNCUE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.RETURNCUE(IMPORTBIGIN)
        } else {
            //epsilon
        }
    }

    //revisar el punto y coma despues de la declaracion
    SFOR(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("FOR", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.FOR, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("DECLARACION", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.DECLARACION(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("EXP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("EXP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEDER, IMPORTBIGIN);
    }

    SWHILE(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("WHILE", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.WHILE, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("EXP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEDER, IMPORTBIGIN);
    }

    SDOWHILE(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("DO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.DO, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("WHILE", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.WHILE, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("EXP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
    }

    SIF(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("IF", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.IF, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("EXP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EXP(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveIzq", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEIZQ, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.CUERPO(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("LlaveDer", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.LLAVEDER, IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("ELSE", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.ELSE(IMPORTBIGIN);
    }

    ELSE(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.ELSE) {
            let IMPORTBIGIN = new Nodo_Arbol("ELSE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ELSE, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ELSE2", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ELSE2(IMPORTBIGIN);
        } else {
            //epsilon
        }
    }

    ELSE2(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.IF) {
            let IMPORTBIGIN = new Nodo_Arbol("SIF", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.SIF(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.LLAVEIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("LlaveIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.LLAVEIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CUERPO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.CUERPO(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("LlaveDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.LLAVEDER, IMPORTBIGIN);
        } else {
            //epsilon
        }
    }

    EXP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.ADMIRACION) {
            let IMPORTBIGIN = new Nodo_Arbol("ADMIRAICON", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ADMIRACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXPP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXPP(IMPORTBIGIN);
        } else {
            let IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXPP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXPP(IMPORTBIGIN);
        }
    }

    EXPP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.AND) {
            let IMPORTBIGIN = new Nodo_Arbol("AND", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.AND, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("AND", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.AND, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.OR) {
            let IMPORTBIGIN = new Nodo_Arbol("OR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.OR, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("OR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.OR, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.XOR) {
            let IMPORTBIGIN = new Nodo_Arbol("XOR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.XOR, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.MAYORQ && this.listaTokens[this.pos + 1].token == TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new Nodo_Arbol("MAYORQ", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.MAYORQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.MENORQ && this.listaTokens[this.pos + 1].token == TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new Nodo_Arbol("MENORQ", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.MENORQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.MAYORQ) {
            let IMPORTBIGIN = new Nodo_Arbol("MAYORQ", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.MAYORQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.MENORQ) {
            let IMPORTBIGIN = new Nodo_Arbol("MENORQ", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.MENORQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("MAYORQ", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.ADMIRACION) {
            let IMPORTBIGIN = new Nodo_Arbol("ADMIRACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ADMIRACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EXP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EXP(IMPORTBIGIN);
        }
    }

    E(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("T", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.T(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("EP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.EP(IMPORTBIGIN);
    }

    EP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.MAS) {
            let IMPORTBIGIN = new Nodo_Arbol("MAS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.MAS, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("T", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.T(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.GUION) {
            let IMPORTBIGIN = new Nodo_Arbol("Menos", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.GUION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("T", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.T(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("EP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.EP(IMPORTBIGIN);
        } else {
            //epsilon
        }
    }

    T(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("F", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.F(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("TP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.TP(IMPORTBIGIN);
    }

    TP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.ASTERISCO) {
            let IMPORTBIGIN = new Nodo_Arbol("ASTERISCO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASTERISCO, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("F", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("TP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TP(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.DIAGONAL) {
            let IMPORTBIGIN = new Nodo_Arbol("DIAGONAL", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.DIAGONAL, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("F", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("TP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TP(IMPORTBIGIN);
            //Agregar punto para probar
        } else if (this.preAnalisis == TypeToken.PUNTO) {
            let IMPORTBIGIN = new Nodo_Arbol("Punto", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PUNTO, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("F", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("TP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.TP(IMPORTBIGIN);
        } else {
            //epsilon
        }
    }

    F(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.NUMERO) {
            let IMPORTBIGIN = new Nodo_Arbol("NUMERO", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.NUMERO, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.GUION) {
            let IMPORTBIGIN = new Nodo_Arbol("MENOS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.GUION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("F", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.F(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.TRUE || this.preAnalisis == TypeToken.FALSE) {
            if (this.preAnalisis == TypeToken.TRUE) {
                let IMPORTBIGIN = new Nodo_Arbol("TRUE", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(TypeToken.TRUE, IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("E", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            } else {
                let IMPORTBIGIN = new Nodo_Arbol("FALSE", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(TypeToken.FALSE, IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("E", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            }

        } else if (this.preAnalisis == TypeToken.ID) {
            let IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.COMA) {
            let IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMA, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.COMILLAS || this.preAnalisis == TypeToken.COMILLASIMPLE) {
            if (this.preAnalisis == TypeToken.COMILLAS) {
                let IMPORTBIGIN = new Nodo_Arbol("Comillas", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(TypeToken.COMILLAS, IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("IMPCUEP", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.IMPCUEP(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("Comillas", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(TypeToken.COMILLAS, IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("E", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            } else {
                let IMPORTBIGIN = new Nodo_Arbol("ComillaS", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(TypeToken.COMILLASIMPLE, IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("IMPCUEP", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.IMPCUEP(IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("ComillaS", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.emparejar(TypeToken.COMILLASIMPLE, IMPORTBIGIN);
                IMPORTBIGIN = new Nodo_Arbol("E", "")
                nodoArriba.agregarHijo(IMPORTBIGIN);
                this.E(IMPORTBIGIN);
            }
        } else {
            //nada
        }

    }

    TIPO(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.VOID) {
            let IMPORTBIGIN = new Nodo_Arbol("VOID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.VOID, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.STRING) {
            let IMPORTBIGIN = new Nodo_Arbol("STRING", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.STRING, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.INT) {
            let IMPORTBIGIN = new Nodo_Arbol("INT", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.INT, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.CHAR) {
            let IMPORTBIGIN = new Nodo_Arbol("CHAR", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.CHAR, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.BOOLEAN) {
            let IMPORTBIGIN = new Nodo_Arbol("BOOLEAN", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.BOOLEAN, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.FLOAT) {
            let IMPORTBIGIN = new Nodo_Arbol("FLOAT", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.FLOAT, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.DOUBLE) {
            let IMPORTBIGIN = new Nodo_Arbol("DOUBLE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.DOUBLE, IMPORTBIGIN);

        }
    }

    MODIFICADOR(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PUBLIC) {
            let IMPORTBIGIN = new Nodo_Arbol("PUBLIC", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PUBLIC, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.PRIVATE) {
            let IMPORTBIGIN = new Nodo_Arbol("PRIVATE", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PRIVATE, IMPORTBIGIN);

        } else if (this.preAnalisis == TypeToken.PROTECTED) {
            let IMPORTBIGIN = new Nodo_Arbol("PROTECTED", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PROTECTED, IMPORTBIGIN);

        } else {
            //EPSILON
        }
    }

    PACKAGEBODY(nodoArriba: Nodo_Arbol) {
        let ImpBody = new Nodo_Arbol("ImpBody", "")
        nodoArriba.agregarHijo(ImpBody);
        this.emparejar(TypeToken.ID, ImpBody);
        let pp = new Nodo_Arbol("PP", "")
        nodoArriba.agregarHijo(pp);
        this.PP(pp);
        ImpBody = new Nodo_Arbol("PyComa", "")
        nodoArriba.agregarHijo(ImpBody);
        this.emparejar(TypeToken.PCOMA, ImpBody);

    }
    PP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.PUNTO) {
            let ImpBody = new Nodo_Arbol(".", "Punto")
            nodoArriba.agregarHijo(ImpBody);
            this.emparejar(TypeToken.PUNTO, ImpBody);
            let pp = new Nodo_Arbol("PP", "")
            nodoArriba.agregarHijo(pp);
            this.PP(pp);
        } else if (this.preAnalisis == TypeToken.ASTERISCO) {
            let ImpBody = new Nodo_Arbol("*", "Asterisco")
            nodoArriba.agregarHijo(ImpBody);
            this.emparejar(TypeToken.ASTERISCO, ImpBody);
            let pp = new Nodo_Arbol("PP", "")
            nodoArriba.agregarHijo(pp);
            this.PP(pp);
        } else if (this.preAnalisis == TypeToken.ID) {
            let ImpBody = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(ImpBody);
            this.emparejar(TypeToken.ID, ImpBody);
            let pp = new Nodo_Arbol("PP", "")
            nodoArriba.agregarHijo(pp);
            this.PP(pp);
        } else {
            //EPSILON
        }
    }

    DECLARACION(nodoArriba: Nodo_Arbol) {
        let IMPORTBIGIN = new Nodo_Arbol("TIPO", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.TIPO(IMPORTBIGIN);
        if (this.preAnalisis == TypeToken.CORCHETEIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("CorchIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.CORCHETEIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("CorchDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.CORCHETEDER, IMPORTBIGIN);
        }
        IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.ASIGNACION(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("DECLARACIONP", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.DECLARACIONP(IMPORTBIGIN);
        IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
        nodoArriba.agregarHijo(IMPORTBIGIN);
        this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
    }

    DECLARACIONP(nodoArriba: Nodo_Arbol) {
        //if (this.preAnalisis == TypeToken.PCOMA) {
        // this.emparejar(TypeToken.PCOMA);
        //} else 
        if (this.preAnalisis == TypeToken.COMA) {
            let IMPORTBIGIN = new Nodo_Arbol("COMA", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.COMA, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("DECLARACIONP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.DECLARACIONP(IMPORTBIGIN);
        } else {
            //EPSILON
        }
    }

    ASIGNACION(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.ID) {
            let IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.ASIGNACION) {
            let IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ASIGNACION, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGP", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGP(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("E", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.E(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
        } else if (this.preAnalisis == TypeToken.PARENTESISIZQ) {
            let IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.METODOSP(IMPORTBIGIN);
        }
        //else if (this.preAnalisis==TypeToken.PCOMA) {
        //   this.emparejar(TypeToken.PCOMA);
        //}
        else {
            //EPSILON
        }
    }

    ASIGP(nodoArriba: Nodo_Arbol) {
        if (this.preAnalisis == TypeToken.NEW) {
            let IMPORTBIGIN = new Nodo_Arbol("NEW", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.NEW, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ID", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.ID, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenIzq", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISIZQ, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PARAMETROS", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.PARAMETROS(IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ParenDer", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PARENTESISDER, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("PyComa", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.emparejar(TypeToken.PCOMA, IMPORTBIGIN);
            IMPORTBIGIN = new Nodo_Arbol("ASIGNACION", "")
            nodoArriba.agregarHijo(IMPORTBIGIN);
            this.ASIGNACION(IMPORTBIGIN);
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