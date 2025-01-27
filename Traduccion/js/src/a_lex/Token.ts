export enum TypeToken{
   //--------------------SIMBOLOS---------
    LLAVEIZQ,
    LLAVEDER,
    PCOMA,
    COMA,
    PUNTO,
    PARENTESISIZQ,
    PARENTESISDER,
    COMILLAS,
    ASTERISCO,
    GUION,
    PORCENTAJE,
    DIAGONAL,
    ASIGNACION,
    MAS,
    MENORQ,
    MAYORQ,
    AND ,
    POTENCIA,
    OR ,
    XOR,
    COMILLASIMPLE,
    TILDE,
    GUIONBAJO,
    ADMIRACION,
    CORCHETEIZQ,
    CORCHETEDER,
    EÑE,
    DPUNTOS,

    //-----------------RESERVADAS---------
    CONTINUE,
    BREAK,
    RETURN,
    IF,
    ELSE,
    FOR,
    WHILE,
    DO,
    FUNCTION,
    CLASS,
    CONSTRUCTOR,
    NULL,
    DELETE, 
    TRUE,
    FALSE,
    NEW,
    UNDEFINED,
    TYPEOF,
    VOID,
    CONSOLE,
    CONST,
    CASE,
    CATCH,
    DEFAULT,
    EXPORT,
    EXTENDS,
    FINALLY,
    IMPORT,
    IN,
    INSTANCEOF,
    SWITCH,
    THIS,
    THROW,
    TRY,
    WITH,
    STATIC,
    PRIVATE,
    PROTECTED,
    PUBLIC,
    INTERFACE,
    INT,
    STRING,
    BOOLEAN,
    FLOAT,
    CHAR,
    DOUBLE,
    SYSTEM,
    OUT,
    PRINT,
    PRINTLN,
    PACKAGE,
    //-----------------------Expresiones 
    ID,
    NUMERO,
    CADENA,
    COMENTARIO,
    NINGUNO

}

export class Token{

    token: TypeToken;
    lexema: string;

    constructor(token:TypeToken, lexema:string){
        this.token = token;
        this.lexema = lexema;
    }
}

export class Error{
    columna:number;
    fila:number;
    lexema: string;

    constructor(columna:number, fila:number, lexema:string){
        this.columna =columna;
        this.fila= fila;
        this.lexema= lexema;
    }
}