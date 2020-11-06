"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const Token_1 = require("./Token");
const Token_2 = require("./Token");
class Scanner {
    constructor() {
        this.isLetra = (caracter) => {
            let ascii = caracter.toUpperCase().charCodeAt(0);
            //ASCII A:65 y Z:90
            return ascii > 64 && ascii < 91;
        };
        this.lista_Tokens = [];
        this.lista_Errores = [];
        this.pos_errores = [];
        this.columna = 1;
        this.fila = 1;
        this.pos = 0;
        this.cadena = "";
        this.lexema = "";
    }
    getErrores() {
        return this.pos_errores;
    }
    Analizar(entrada) {
        this.estadoA(entrada);
        return this.lista_Tokens;
    }
    estadoA(entrada) {
        this.cadena = entrada + '$';
        let c = "";
        while (this.pos < entrada.length) {
            c = this.cadena.charAt(this.pos);
            //----------------------SIMBOLOS ACEPTADOS--------
            if (c == '/') {
                this.estadoB(this.pos);
            }
            else if (c == '*') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ASTERISCO, '*'));
            }
            else if (c == ':') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DPUNTOS, ':'));
            }
            else if (c == ';') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PCOMA, ';'));
            }
            else if (c == '.') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PUNTO, '.'));
            }
            else if (c == '\'') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.COMILLASIMPLE, '\''));
                this.pos += 1;
                let sizeCadena = this.getSizeCadena(this.pos);
                this.estadoE(this.pos, this.pos + sizeCadena);
                this.pos = this.pos + sizeCadena;
                this.estadoJ(this.pos);
            }
            else if (c == '"') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.COMILLAS, '"'));
                this.pos += 1;
                let sizeCadena = this.getSizeCadena(this.pos);
                this.estadoE(this.pos, this.pos + sizeCadena);
                this.pos = this.pos + sizeCadena;
                this.estadoJ(this.pos);
            }
            else if (c == '`') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.TILDE, '`'));
                this.pos += 1;
                let sizeCadena = this.getSizeCadena(this.pos);
                this.estadoE(this.pos, this.pos + sizeCadena);
                this.pos = this.pos + sizeCadena;
                this.estadoJ(this.pos);
            }
            else if (c == '+') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.MAS, '+'));
            }
            else if (c == '-') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.GUION, '-'));
            }
            else if (c == '=') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ASIGNACION, '='));
            }
            else if (c == '&') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.AND, '&'));
            }
            else if (c == '|') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.OR, '|'));
            }
            else if (c == '(') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PARENTESISIZQ, '('));
            }
            else if (c == ')') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PARENTESISDER, ')'));
            }
            else if (c == '{') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.LLAVEIZQ, '{'));
            }
            else if (c == '}') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.LLAVEDER, '}'));
            }
            else if (c == '[') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CORCHETEIZQ, '['));
            }
            else if (c == ']') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CORCHETEDER, ']'));
            }
            else if (c == '<') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.MENORQ, '<'));
            }
            else if (c == '>') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.MAYORQ, '>'));
            }
            else if (c == '!') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ADMIRACION, '!'));
            }
            else if (c == '%') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PORCENTAJE, '%'));
            }
            else if (c == '_') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.GUIONBAJO, '_'));
            }
            else if (c == ',') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.COMA, ','));
            }
            else if (c == '^') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.XOR, '^'));
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
                }
                else {
                    this.columna += 1;
                }
            }
            //---Manejo de Errores
            else {
                if (c == '$' && this.pos == this.cadena.length - 1) {
                    //Reportes y correccion de errores
                    //correccion.eliminarC(self.rutaDestino1,entrada,"js",self.pos_errores)
                    console.log("analisis exitoso!!");
                }
                else {
                    this.lista_Errores.push(new Token_1.Error(this.columna, this.fila, c));
                    this.pos_errores.push(this.pos);
                }
            }
            this.columna += 1;
            this.pos += 1;
        }
    }
    //verificar el / porque si viene un numero y luego una / 5/5 creo que da error
    estadoB(posActual) {
        let c = this.cadena.charAt(posActual + 1);
        if (c == '*') {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DIAGONAL, '/'));
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ASTERISCO, '*'));
            this.pos = posActual + 2;
            let sizeComentario = this.getSizeComentarioMulti(this.pos);
            this.estadoH(this.pos, this.pos + sizeComentario);
            this.pos = this.pos + sizeComentario;
            this.estadoL(this.pos);
        }
        else if (c == '/') {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DIAGONAL, '/'));
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DIAGONAL, '/'));
            this.pos = posActual + 2;
            let sizeComentario = this.getSizeComentarioUni(this.pos);
            this.estadoI(this.pos, this.pos + sizeComentario);
            this.pos = this.pos + sizeComentario;
        }
        else {
            let f = this.cadena.charAt(posActual);
            if (f == '/') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DIAGONAL, '/'));
            }
            if (c != "\n") {
                this.lista_Errores.push(new Token_1.Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual + 1);
            }
        }
    }
    estadoC(posActual, fin) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            if (this.isLetra(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            }
            else if (this.isNumber(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            }
            else if (c == '-') {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            }
            else if (c == '_') {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    if (this.reservadas(this.lexema) != true) {
                        this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ID, this.lexema));
                    }
                    this.lexema = "";
                }
            }
            else {
                this.lista_Errores.push(new Token_1.Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual + 1);
            }
            posActual += 1;
        }
    }
    estadoE(posActual, fin) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            this.lexema += c;
            if (posActual + 1 == fin) {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CADENA, this.lexema));
                this.lexema = "";
            }
            posActual += 1;
        }
    }
    estadoG(posActual, fin) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            if (this.isNumber(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.NUMERO, this.lexema));
                    this.lexema = "";
                }
            }
            else if (c == '.') {
                //mandar al estado K
                this.lexema += c;
                posActual += 1;
                this.estadoK(posActual, fin);
                break;
            }
            else {
                this.lista_Errores.push(new Token_1.Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual);
            }
            posActual += 1;
        }
    }
    estadoH(posActual, fin) {
        let c = "";
        while (posActual < fin) {
            c = this.cadena[posActual];
            this.lexema += c;
            if (posActual + 1 == fin) {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.COMENTARIO, this.lexema));
                this.lexema = "";
            }
            posActual += 1;
        }
    }
    estadoI(posActual, fin) {
        let c = "";
        while (posActual < fin) {
            c = this.cadena[posActual];
            this.lexema += c;
            if (posActual + 1 == fin) {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.COMENTARIO, this.lexema));
                this.lexema = "";
            }
            posActual += 1;
        }
    }
    estadoJ(posActual) {
        let c = this.cadena[posActual];
        if (c == '"') {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.COMILLAS, c));
        }
        else if (c == "'") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.COMILLASIMPLE, c));
        }
        else if (c == '`') {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.TILDE, c));
        }
    }
    estadoK(posActual, fin) {
        let c = '';
        while (posActual < fin) {
            c = this.cadena[posActual];
            if (this.isNumber(c)) {
                this.lexema += c;
                if (posActual + 1 == fin) {
                    this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.NUMERO, this.lexema));
                    this.lexema = "";
                }
            }
            else {
                this.lista_Errores.push(new Token_1.Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual);
            }
            posActual += 1;
        }
    }
    estadoL(posActual) {
        if (posActual + 1 < this.cadena.length - 1) {
            let c = this.cadena[posActual + 1];
            if (c == '/') {
                this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ASTERISCO, '*'));
                this.pos += 1;
                this.estadoM(this.pos);
            }
            else {
                this.lista_Errores.push(new Token_1.Error(this.columna, this.fila, c));
                this.pos_errores.push(posActual);
            }
        }
    }
    estadoM(posActual) {
        let c = this.cadena[posActual];
        if (c == '/') {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DIAGONAL, '/'));
            this.pos += 1;
            c = this.cadena[this.pos];
            if (c == "\n") {
                this.fila += 1;
                this.columna = 1;
            }
        }
        else {
            this.lista_Errores.push(new Token_1.Error(this.columna, this.fila, c));
            this.pos_errores.push(posActual);
        }
    }
    getSizeLexema(posInicial) {
        let longitud = 0;
        for (posInicial; posInicial < this.cadena.length - 1; posInicial++) {
            if (this.cadena[posInicial] == ' ' || this.cadena[posInicial] == '{' || this.cadena[posInicial] == '}' || this.cadena[posInicial] == '(' || this.cadena[posInicial] == ')' || this.cadena[posInicial] == ',' || this.cadena[posInicial] == '.' || this.cadena[posInicial] == ';' || this.cadena[posInicial] == ':' || this.cadena[posInicial] == '"' || this.cadena[posInicial] == "'" || this.cadena[posInicial] == '`' || this.cadena[posInicial] == '[' || this.cadena[posInicial] == ']' || this.cadena[posInicial] == '*' || this.cadena[posInicial] == '-' || this.cadena[posInicial] == '/' || this.cadena[posInicial] == '+' || this.cadena[posInicial] == '=' || this.cadena[posInicial] == '&' || this.cadena[posInicial] == '|' || this.cadena[posInicial] == '<' || this.cadena[posInicial] == '>' || this.cadena[posInicial] == '!' || this.cadena[posInicial] == '~' || this.cadena[posInicial] == '\n' || this.cadena[posInicial] == '\t' || this.cadena[posInicial] == '\r') {
                if (this.cadena[posInicial] == '\n') {
                    this.fila += 1;
                    this.columna = 1;
                }
                break;
            }
            longitud += 1;
        }
        return longitud;
    }
    getSizeComentarioMulti(posInicial) {
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
    getSizeComentarioUni(posInicial) {
        let longitud = 0;
        for (posInicial; posInicial < this.cadena.length - 1; posInicial++) {
            if (this.cadena[posInicial] == "\n") {
                this.fila += 1;
                this.columna = 1;
                break;
            }
            longitud += 1;
        }
        return longitud;
    }
    getSizeCadena(posInicial) {
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
    isNumber(texto) {
        let numeros = '0123456789';
        for (let i = 0; i < texto.length; i++) {
            if (numeros.indexOf(texto.charAt(i), 0) != -1) {
                return true;
            }
        }
        return false;
    }
    reservadas(palabra) {
        if (palabra.toLocaleLowerCase() == "continue") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CONTINUE, 'continue'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "break") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.BREAK, 'break'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "return") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.RETURN, 'return'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "if") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.IF, 'if'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "else") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.ELSE, 'else'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "for") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.FOR, 'for'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "while") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.WHILE, 'while'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "do") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DO, 'do'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "class") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CLASS, 'class'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "null") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.NULL, 'null'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "delete") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DELETE, 'delete'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "true") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.TRUE, 'true'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "false") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.FALSE, 'false'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "new") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.NEW, 'new'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "void") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.VOID, 'void'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "console") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CONSOLE, 'console'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "final") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CONST, 'final'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "case") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CASE, 'case'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "catch") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CATCH, 'catch'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "default") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DEFAULT, 'default'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "import") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.IMPORT, 'import'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "extends") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.EXTENDS, 'extends'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "finally") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.FINALLY, 'finally'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "in") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.IN, 'in'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "switch") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.SWITCH, 'switch'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "this") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.THIS, 'this'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "throw") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.THROW, 'throw'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "try") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.TRY, 'try'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "with") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.WITH, 'with'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "static") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.STATIC, 'static'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "private") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PRIVATE, 'private'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "protected") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PROTECTED, 'protected'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "public") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PUBLIC, 'public'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "interface") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.INTERFACE, 'interface'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "int") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.INT, 'int'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "string") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.STRING, 'string'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "boolean") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.BOOLEAN, 'boolean'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "float") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.FLOAT, 'float'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "char") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.CHAR, 'char'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "double") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.DOUBLE, 'double'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "system") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.SYSTEM, 'system'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "out") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.OUT, 'out'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "print") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PRINT, 'print'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "println") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PRINTLN, 'println'));
            return true;
        }
        else if (palabra.toLocaleLowerCase() == "package") {
            this.lista_Tokens.push(new Token_1.Token(Token_2.TypeToken.PACKAGE, 'package'));
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Scanner = Scanner;
