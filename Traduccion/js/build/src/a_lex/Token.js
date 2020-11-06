"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = exports.Token = exports.TypeToken = void 0;
var TypeToken;
(function (TypeToken) {
    //--------------------SIMBOLOS---------
    TypeToken[TypeToken["LLAVEIZQ"] = 0] = "LLAVEIZQ";
    TypeToken[TypeToken["LLAVEDER"] = 1] = "LLAVEDER";
    TypeToken[TypeToken["PCOMA"] = 2] = "PCOMA";
    TypeToken[TypeToken["COMA"] = 3] = "COMA";
    TypeToken[TypeToken["PUNTO"] = 4] = "PUNTO";
    TypeToken[TypeToken["PARENTESISIZQ"] = 5] = "PARENTESISIZQ";
    TypeToken[TypeToken["PARENTESISDER"] = 6] = "PARENTESISDER";
    TypeToken[TypeToken["COMILLAS"] = 7] = "COMILLAS";
    TypeToken[TypeToken["ASTERISCO"] = 8] = "ASTERISCO";
    TypeToken[TypeToken["GUION"] = 9] = "GUION";
    TypeToken[TypeToken["PORCENTAJE"] = 10] = "PORCENTAJE";
    TypeToken[TypeToken["DIAGONAL"] = 11] = "DIAGONAL";
    TypeToken[TypeToken["ASIGNACION"] = 12] = "ASIGNACION";
    TypeToken[TypeToken["MAS"] = 13] = "MAS";
    TypeToken[TypeToken["MENORQ"] = 14] = "MENORQ";
    TypeToken[TypeToken["MAYORQ"] = 15] = "MAYORQ";
    TypeToken[TypeToken["AND"] = 16] = "AND";
    TypeToken[TypeToken["POTENCIA"] = 17] = "POTENCIA";
    TypeToken[TypeToken["OR"] = 18] = "OR";
    TypeToken[TypeToken["XOR"] = 19] = "XOR";
    TypeToken[TypeToken["COMILLASIMPLE"] = 20] = "COMILLASIMPLE";
    TypeToken[TypeToken["TILDE"] = 21] = "TILDE";
    TypeToken[TypeToken["GUIONBAJO"] = 22] = "GUIONBAJO";
    TypeToken[TypeToken["ADMIRACION"] = 23] = "ADMIRACION";
    TypeToken[TypeToken["CORCHETEIZQ"] = 24] = "CORCHETEIZQ";
    TypeToken[TypeToken["CORCHETEDER"] = 25] = "CORCHETEDER";
    TypeToken[TypeToken["E\u00D1E"] = 26] = "E\u00D1E";
    TypeToken[TypeToken["DPUNTOS"] = 27] = "DPUNTOS";
    //-----------------RESERVADAS---------
    TypeToken[TypeToken["CONTINUE"] = 28] = "CONTINUE";
    TypeToken[TypeToken["BREAK"] = 29] = "BREAK";
    TypeToken[TypeToken["RETURN"] = 30] = "RETURN";
    TypeToken[TypeToken["IF"] = 31] = "IF";
    TypeToken[TypeToken["ELSE"] = 32] = "ELSE";
    TypeToken[TypeToken["FOR"] = 33] = "FOR";
    TypeToken[TypeToken["WHILE"] = 34] = "WHILE";
    TypeToken[TypeToken["DO"] = 35] = "DO";
    TypeToken[TypeToken["FUNCTION"] = 36] = "FUNCTION";
    TypeToken[TypeToken["CLASS"] = 37] = "CLASS";
    TypeToken[TypeToken["CONSTRUCTOR"] = 38] = "CONSTRUCTOR";
    TypeToken[TypeToken["NULL"] = 39] = "NULL";
    TypeToken[TypeToken["DELETE"] = 40] = "DELETE";
    TypeToken[TypeToken["TRUE"] = 41] = "TRUE";
    TypeToken[TypeToken["FALSE"] = 42] = "FALSE";
    TypeToken[TypeToken["NEW"] = 43] = "NEW";
    TypeToken[TypeToken["UNDEFINED"] = 44] = "UNDEFINED";
    TypeToken[TypeToken["TYPEOF"] = 45] = "TYPEOF";
    TypeToken[TypeToken["VOID"] = 46] = "VOID";
    TypeToken[TypeToken["CONSOLE"] = 47] = "CONSOLE";
    TypeToken[TypeToken["CONST"] = 48] = "CONST";
    TypeToken[TypeToken["CASE"] = 49] = "CASE";
    TypeToken[TypeToken["CATCH"] = 50] = "CATCH";
    TypeToken[TypeToken["DEFAULT"] = 51] = "DEFAULT";
    TypeToken[TypeToken["EXPORT"] = 52] = "EXPORT";
    TypeToken[TypeToken["EXTENDS"] = 53] = "EXTENDS";
    TypeToken[TypeToken["FINALLY"] = 54] = "FINALLY";
    TypeToken[TypeToken["IMPORT"] = 55] = "IMPORT";
    TypeToken[TypeToken["IN"] = 56] = "IN";
    TypeToken[TypeToken["INSTANCEOF"] = 57] = "INSTANCEOF";
    TypeToken[TypeToken["SWITCH"] = 58] = "SWITCH";
    TypeToken[TypeToken["THIS"] = 59] = "THIS";
    TypeToken[TypeToken["THROW"] = 60] = "THROW";
    TypeToken[TypeToken["TRY"] = 61] = "TRY";
    TypeToken[TypeToken["WITH"] = 62] = "WITH";
    TypeToken[TypeToken["STATIC"] = 63] = "STATIC";
    TypeToken[TypeToken["PRIVATE"] = 64] = "PRIVATE";
    TypeToken[TypeToken["PROTECTED"] = 65] = "PROTECTED";
    TypeToken[TypeToken["PUBLIC"] = 66] = "PUBLIC";
    TypeToken[TypeToken["INTERFACE"] = 67] = "INTERFACE";
    TypeToken[TypeToken["INT"] = 68] = "INT";
    TypeToken[TypeToken["STRING"] = 69] = "STRING";
    TypeToken[TypeToken["BOOLEAN"] = 70] = "BOOLEAN";
    TypeToken[TypeToken["FLOAT"] = 71] = "FLOAT";
    TypeToken[TypeToken["CHAR"] = 72] = "CHAR";
    TypeToken[TypeToken["DOUBLE"] = 73] = "DOUBLE";
    TypeToken[TypeToken["SYSTEM"] = 74] = "SYSTEM";
    TypeToken[TypeToken["OUT"] = 75] = "OUT";
    TypeToken[TypeToken["PRINT"] = 76] = "PRINT";
    TypeToken[TypeToken["PRINTLN"] = 77] = "PRINTLN";
    TypeToken[TypeToken["PACKAGE"] = 78] = "PACKAGE";
    //-----------------------Expresiones 
    TypeToken[TypeToken["ID"] = 79] = "ID";
    TypeToken[TypeToken["NUMERO"] = 80] = "NUMERO";
    TypeToken[TypeToken["CADENA"] = 81] = "CADENA";
    TypeToken[TypeToken["COMENTARIO"] = 82] = "COMENTARIO";
    TypeToken[TypeToken["NINGUNO"] = 83] = "NINGUNO";
})(TypeToken = exports.TypeToken || (exports.TypeToken = {}));
class Token {
    constructor(token, lexema) {
        this.token = token;
        this.lexema = lexema;
    }
}
exports.Token = Token;
class Error {
    constructor(columna, fila, lexema) {
        this.columna = columna;
        this.fila = fila;
        this.lexema = lexema;
    }
}
exports.Error = Error;
