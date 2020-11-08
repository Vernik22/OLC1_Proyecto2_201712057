import { Token, Error } from './Token';
import { TypeToken } from './Token';

export class Scanner {
    lista_Tokens: Token[];
    lista_Errores: Error[];
    pos_errores: number[];
    columna: number;
    fila: number;
    pos: number;

    cadena: String;
    lexema: string;

    constructor() {
        this.lista_Tokens = [];
        this.lista_Errores = [];
        this.pos_errores = [];
        this.columna = 1;
        this.fila = 1;
        this.pos = 0;
        this.cadena = "";
        this.lexema = "";
    }
    getErrores():number[]{
        return this.pos_errores;
    }
    getLerrores():Error[]{
        return this.lista_Errores;
    }
    Analizar(entrada: String): Token[] {

        this.estadoA(entrada);
        return this.lista_Tokens;
    }

    estadoA(entrada: String) {
        this.cadena = entrada + '$';
        let c = "";
        while (this.pos < entrada.length) {
            c = this.cadena.charAt(this.pos);
            //----------------------SIMBOLOS ACEPTADOS--------
            if (c == '/') {
                this.estadoB(this.pos);
            } else if (c == '*') {
                this.lista_Tokens.push(new Token(TypeToken.ASTERISCO, '*'));
            } else if (c == ':') {
                this.lista_Tokens.push(new Token(TypeToken.DPUNTOS, ':'));
            } else if (c == ';') {
                this.lista_Tokens.push(new Token(TypeToken.PCOMA, ';'));
            } else if (c == '.') {
                this.lista_Tokens.push(new Token(TypeToken.PUNTO, '.'));
            }else if (c == '\'') {
                this.lista_Tokens.push(new Token(TypeToken.COMILLASIMPLE, '\''));
                this.pos += 1;
                let sizeCadena = this.getSizeCadena(this.pos);
                this.estadoE(this.pos, this.pos + sizeCadena);
                this.pos = this.pos + sizeCadena;
                this.estadoJ(this.pos);

            } else if (c == '"') {
                this.lista_Tokens.push(new Token(TypeToken.COMILLAS, '"'));
                this.pos += 1;
                let sizeCadena = this.getSizeCadena(this.pos);
                this.estadoE(this.pos, this.pos + sizeCadena);
                this.pos = this.pos + sizeCadena;
                this.estadoJ(this.pos);

            } else if (c == '`') {
                this.lista_Tokens.push(new Token(TypeToken.TILDE, '`'));
                this.pos += 1;
                let sizeCadena = this.getSizeCadena(this.pos);
                this.estadoE(this.pos, this.pos + sizeCadena);
                this.pos = this.pos + sizeCadena;
                this.estadoJ(this.pos);
            } else if (c == '+') {
                this.lista_Tokens.push(new Token(TypeToken.MAS, '+'));
            } else if (c == '-') {
                this.lista_Tokens.push(new Token(TypeToken.GUION, '-'));
            } else if (c == '=') {
                this.lista_Tokens.push(new Token(TypeToken.ASIGNACION, '='));
            } else if (c == '&') {
                this.lista_Tokens.push(new Token(TypeToken.AND, '&'));
            } else if (c == '|') {
                this.lista_Tokens.push(new Token(TypeToken.OR, '|'));
            } else if (c == '(') {
                this.lista_Tokens.push(new Token(TypeToken.PARENTESISIZQ, '('));
            } else if (c == ')') {
                this.lista_Tokens.push(new Token(TypeToken.PARENTESISDER, ')'));
            } else if (c == '{') {
                this.lista_Tokens.push(new Token(TypeToken.LLAVEIZQ, '{'));
            } else if (c == '}') {
                this.lista_Tokens.push(new Token(TypeToken.LLAVEDER, '}'));
            } else if (c == '[') {
                this.lista_Tokens.push(new Token(TypeToken.CORCHETEIZQ, '['));
            } else if (c == ']') {
                this.lista_Tokens.push(new Token(TypeToken.CORCHETEDER, ']'));
            } else if (c == '<') {
                this.lista_Tokens.push(new Token(TypeToken.MENORQ, '<'));
            } else if (c == '>') {
                this.lista_Tokens.push(new Token(TypeToken.MAYORQ, '>'));
            } else if (c == '!') {
                this.lista_Tokens.push(new Token(TypeToken.ADMIRACION, '!'));
            } else if (c == '%') {
                this.lista_Tokens.push(new Token(TypeToken.PORCENTAJE, '%'));
            } else if (c == '_') {
                this.lista_Tokens.push(new Token(TypeToken.GUIONBAJO, '_'));
            } else if (c == ',') {
                this.lista_Tokens.push(new Token(TypeToken.COMA, ','));
            } else if (c == '^') {
                this.lista_Tokens.push(new Token(TypeToken.XOR, '^'));
            }
            //---estado A a estado G (Numeros)
            else if (this.isNumber(c)) {
                let sizeLexema = this.getSizeLexema(this.pos);
                this.estadoG(this.pos, this.pos + sizeLexema);
                this.pos = this.pos + sizeLexema - 1;
            }
            //---estado A a estado C (Reservadas e IDs)
            else if (this.isLetra(c)) {
                let sizeLexema = this.getSizeLexema(this.pos);
                this.estadoC(this.pos, this.pos + sizeLexema);
                this.pos = this.pos + sizeLexema - 1;
            }
            //---Otros
            else if (c == ' ' || c == '\t' || c == '\r' || c == '\n') {
                if (c == '\n') {
                    this.fila += 1;
                    this.columna = 1;
                } else {
                    this.columna += 1;
                }

            }
            //---Manejo de Errores
            else {
                if (c == '$' && this.pos == this.cadena.length - 1) {
                    //Reportes y correccion de errores
                    //correccion.eliminarC(self.rutaDestino1,entrada,"js",self.pos_errores)
                    console.log("analisis exitoso!!");
                } else {
                    this.lista_Errores.push(new Error(this.columna, this.fila, c));
                    this.pos_errores.push(this.pos);
                }
            }
            this.columna += 1;
            this.pos += 1;

        }
    }
    //verificar el / porque si viene un numero y luego una / 5/5 creo que da error
    estadoB(posActual: number) {
        let c = this.cadena.charAt(posActual + 1);
        if (c == '*') {
            this.lista_Tokens.push(new Token(TypeToken.DIAGONAL, '/'));
            this.lista_Tokens.push(new Token(TypeToken.ASTERISCO, '*'));
            this.pos = posActual + 2;
            let sizeComentario = this.getSizeComentarioMulti(this.pos);
            this.estadoH(this.pos, this.pos + sizeComentario);
            this.pos = this.pos + sizeComentario;
            this.estadoL(this.pos);
        } else if (c == '/') {
            this.lista_Tokens.push(new Token(TypeToken.DIAGONAL, '/'));
            this.lista_Tokens.push(new Token(TypeToken.DIAGONAL, '/'));
            this.pos = posActual + 2;
            let sizeComentario = this.getSizeComentarioUni(this.pos);
            this.estadoI(this.pos, this.pos + sizeComentario);
            this.pos = this.pos + sizeComentario;
        } else {
            let f = this.cadena.charAt(posActual);
            if (f == '/') {
                this.lista_Tokens.push(new Token(TypeToken.DIAGONAL, '/'));
            }
            if (c != "\n") {
                this.lista_Errores.push(new Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual + 1);
            }
        }

    }

    estadoC(posActual: number, fin: number) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            if (this.isLetra(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token(TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            } else if (this.isNumber(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token(TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            } else if (c == '-') {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token(TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            } else if (c == '_') {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token(TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            } else {
                this.lista_Errores.push(new Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual );
            }
            posActual += 1;
        }
    }

    estadoE(posActual: number, fin: number) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            this.lexema += c;
            if (posActual + 1 == fin) {
                this.lista_Tokens.push(new Token(TypeToken.CADENA, this.lexema));
                this.lexema = "";
            }
            posActual += 1;
        }
    }

    estadoG(posActual: number, fin: number) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            if (this.isNumber(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    this.lista_Tokens.push(new Token(TypeToken.NUMERO, this.lexema));
                    this.lexema = "";
                }
            } else if (c == '.') {
                //mandar al estado K
                this.lexema += c;
                posActual += 1;
                this.estadoK(posActual, fin);
                break;
            } else {
                this.lista_Errores.push(new Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual);
            }
            posActual += 1;
        }
    }

    estadoH(posActual: number, fin: number) {
        let c = "";
        while (posActual < fin) {
            c = this.cadena[posActual];
            this.lexema += c;
            if (posActual + 1 == fin) {
                this.lista_Tokens.push(new Token(TypeToken.COMENTARIO, this.lexema));
                this.lexema = "";
            }
            posActual += 1;
        }
    }

    estadoI(posActual: number, fin: number) {
        let c = "";
        while (posActual < fin) {
            c = this.cadena[posActual];
            this.lexema += c;
            if (posActual + 1 == fin) {
                this.lista_Tokens.push(new Token(TypeToken.COMENTARIO, this.lexema));
                this.lexema = "";
            }
            posActual += 1;
        }
    }

    estadoJ(posActual: number) {
        let c = this.cadena[posActual];
        if (c == '"') {
            this.lista_Tokens.push(new Token(TypeToken.COMILLAS, c));
            
        } else if (c == "'") {
            this.lista_Tokens.push(new Token(TypeToken.COMILLASIMPLE, c));
            
        } else if (c == '`') {
            this.lista_Tokens.push(new Token(TypeToken.TILDE, c));
            
        }
    }

    estadoK(posActual: number, fin: number) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            if (this.isNumber(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    this.lista_Tokens.push(new Token(TypeToken.NUMERO, this.lexema));
                    this.lexema = "";
                }
            } else {
                this.lista_Errores.push(new Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual);
            }
            posActual += 1;
        }
    }

    estadoL(posActual: number) {
        if (posActual + 1 < this.cadena.length - 1) {
            let c = this.cadena[posActual + 1];
            if (c == '/') {
                this.lista_Tokens.push(new Token(TypeToken.ASTERISCO, '*'));
                this.pos += 1;
                this.estadoM(this.pos);
            } else {
                this.lista_Errores.push(new Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual);
            }
        }
    }
    estadoM(posActual: number) {
        let c = this.cadena[posActual];
        if (c == '/') {
            this.lista_Tokens.push(new Token(TypeToken.DIAGONAL, '/'));
            this.pos += 1;
            c = this.cadena[this.pos];
            if (c == "\n") {
                this.fila += 1;
                this.columna = 1;
            }
        } else {
            this.lista_Errores.push(new Error(this.columna, this.fila, c));
            this.pos_errores.push(posActual);
        }
    }

    getSizeLexema(posInicial: number): number {
        let longitud = 0;
        for (posInicial; posInicial < this.cadena.length - 1; posInicial++) {
            if (this.cadena[posInicial] == ' ' || this.cadena[posInicial] == '{' || this.cadena[posInicial] == '}' || this.cadena[posInicial] == '(' || this.cadena[posInicial] == ')' || this.cadena[posInicial] == ',' || this.cadena[posInicial] == '.' || this.cadena[posInicial] == ';' || this.cadena[posInicial] == ':' || this.cadena[posInicial] == '"' || this.cadena[posInicial] == "'" || this.cadena[posInicial] == '`' || this.cadena[posInicial] == '[' || this.cadena[posInicial] == ']' || this.cadena[posInicial] == '*' || this.cadena[posInicial] == '-' || this.cadena[posInicial] == '/' || this.cadena[posInicial] == '+' || this.cadena[posInicial] == '=' || this.cadena[posInicial] == '&' || this.cadena[posInicial] == '|' || this.cadena[posInicial] == '<' || this.cadena[posInicial] == '>' || this.cadena[posInicial] == '!' || this.cadena[posInicial] == '~' || this.cadena[posInicial] == '\n' || this.cadena[posInicial] == '\t' || this.cadena[posInicial] == '\r') {
                if (this.cadena[posInicial] == '\n') {
                    this.fila += 1;
                    this.columna = 1;
                }
                break
            }
            longitud += 1;
        }
        return longitud;
    }

    getSizeComentarioMulti(posInicial: number): number {
        let longitud = 0;
        for (posInicial; posInicial < this.cadena.length - 1; posInicial++) {
            if (this.cadena[posInicial] == "\n") {
                this.fila += 1;
                this.columna = 1;
            }
            if (this.cadena[posInicial] == '*' && this.cadena[posInicial + 1] == '/') {
                break;
            }

            longitud += 1;
        }
        return longitud;
    }

    getSizeComentarioUni(posInicial: number): number {
        let longitud = 0;
        for (posInicial; posInicial < this.cadena.length - 1; posInicial++) {
            if (this.cadena[posInicial] == "\n") {
                this.fila += 1;
                this.columna = 1;
                break
            }
            longitud += 1;
        }
        return longitud;
    }

    getSizeCadena(posInicial: number): number {
        let longitud = 0;
        for (posInicial; posInicial < this.cadena.length; posInicial++) {
            if (this.cadena[posInicial] == "\n") {
                this.fila += 1;
                this.columna = 1;
            }
            if (this.cadena[posInicial] == '"' || this.cadena[posInicial] == "'" || this.cadena[posInicial] == '`') {
                break;
            }

            longitud += 1;
        }
        return longitud;
    }

    isNumber(texto: String): boolean {
        let numeros = '0123456789';
        for (let i = 0; i < texto.length; i++) {
            if (numeros.indexOf(texto.charAt(i), 0) != -1) {
                return true;
            }
        }
        return false;
    }

    isLetra = (caracter: any) => {
        let ascii = caracter.toUpperCase().charCodeAt(0);
        //ASCII A:65 y Z:90
        return ascii > 64 && ascii < 91;
    };

    reservadas(palabra: String): boolean {
        if (palabra.toLocaleLowerCase() == "continue") {
            this.lista_Tokens.push(new Token(TypeToken.CONTINUE, 'continue'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "break") {
            this.lista_Tokens.push(new Token(TypeToken.BREAK, 'break'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "return") {
            this.lista_Tokens.push(new Token(TypeToken.RETURN, 'return'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "if") {
            this.lista_Tokens.push(new Token(TypeToken.IF, 'if'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "else") {
            this.lista_Tokens.push(new Token(TypeToken.ELSE, 'else'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "for") {
            this.lista_Tokens.push(new Token(TypeToken.FOR, 'for'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "while") {
            this.lista_Tokens.push(new Token(TypeToken.WHILE, 'while'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "do") {
            this.lista_Tokens.push(new Token(TypeToken.DO, 'do'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "class") {
            this.lista_Tokens.push(new Token(TypeToken.CLASS, 'class'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "null") {
            this.lista_Tokens.push(new Token(TypeToken.NULL, 'null'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "delete") {
            this.lista_Tokens.push(new Token(TypeToken.DELETE, 'delete'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "true") {
            this.lista_Tokens.push(new Token(TypeToken.TRUE, 'true'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "false") {
            this.lista_Tokens.push(new Token(TypeToken.FALSE, 'false'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "new") {
            this.lista_Tokens.push(new Token(TypeToken.NEW, 'new'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "void") {
            this.lista_Tokens.push(new Token(TypeToken.VOID, 'void'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "console") {
            this.lista_Tokens.push(new Token(TypeToken.CONSOLE, 'console'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "final") {
            this.lista_Tokens.push(new Token(TypeToken.CONST, 'final'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "case") {
            this.lista_Tokens.push(new Token(TypeToken.CASE, 'case'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "catch") {
            this.lista_Tokens.push(new Token(TypeToken.CATCH, 'catch'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "default") {
            this.lista_Tokens.push(new Token(TypeToken.DEFAULT, 'default'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "import") {
            this.lista_Tokens.push(new Token(TypeToken.IMPORT, 'import'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "extends") {
            this.lista_Tokens.push(new Token(TypeToken.EXTENDS, 'extends'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "finally") {
            this.lista_Tokens.push(new Token(TypeToken.FINALLY, 'finally'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "in") {
            this.lista_Tokens.push(new Token(TypeToken.IN, 'in'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "switch") {
            this.lista_Tokens.push(new Token(TypeToken.SWITCH, 'switch'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "this") {
            this.lista_Tokens.push(new Token(TypeToken.THIS, 'this'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "throw") {
            this.lista_Tokens.push(new Token(TypeToken.THROW, 'throw'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "try") {
            this.lista_Tokens.push(new Token(TypeToken.TRY, 'try'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "with") {
            this.lista_Tokens.push(new Token(TypeToken.WITH, 'with'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "static") {
            this.lista_Tokens.push(new Token(TypeToken.STATIC, 'static'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "private") {
            this.lista_Tokens.push(new Token(TypeToken.PRIVATE, 'private'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "protected") {
            this.lista_Tokens.push(new Token(TypeToken.PROTECTED, 'protected'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "public") {
            this.lista_Tokens.push(new Token(TypeToken.PUBLIC, 'public'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "interface") {
            this.lista_Tokens.push(new Token(TypeToken.INTERFACE, 'interface'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "int") {
            this.lista_Tokens.push(new Token(TypeToken.INT, 'int'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "string") {
            this.lista_Tokens.push(new Token(TypeToken.STRING, 'string'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "boolean") {
            this.lista_Tokens.push(new Token(TypeToken.BOOLEAN, 'boolean'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "float") {
            this.lista_Tokens.push(new Token(TypeToken.FLOAT, 'float'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "char") {
            this.lista_Tokens.push(new Token(TypeToken.CHAR, 'char'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "double") {
            this.lista_Tokens.push(new Token(TypeToken.DOUBLE, 'double'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "system") {
            this.lista_Tokens.push(new Token(TypeToken.SYSTEM, 'system'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "out") {
            this.lista_Tokens.push(new Token(TypeToken.OUT, 'out'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "print") {
            this.lista_Tokens.push(new Token(TypeToken.PRINT, 'print'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "println") {
            this.lista_Tokens.push(new Token(TypeToken.PRINTLN, 'println'));
            return true;
        } else if (palabra.toLocaleLowerCase() == "package") {
            this.lista_Tokens.push(new Token(TypeToken.PACKAGE, 'package'));
            return true;
        }
        else {
            return false;
        }

    }
}