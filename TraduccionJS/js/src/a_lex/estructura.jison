
%{
    const Nodo_Arbol= require('../Gramatica/nodoArbol');
    var self=this;
   
    var Comillas='\''
    var erroresLex=[];
    var listaTokens="";
    var erroresSin=[];

    self.listaTokens=[];
    self.erroresLex=[];
    self.erroresSin=[];
%}

/*------------------- Lexico-----------------*/

%lex
%options case-sensitive
%%

\s+         /*Omitir espacios en blanco*/
"continue"  %{self.listaTokens.push("continue,"+"continue");return 'tk_continue'; %}
"break"     %{self.listaTokens.push("break,"+"break"); return 'tk_break'; %}
"return"    %{self.listaTokens.push("return,"+"return"); return 'tk_return'; %}
"if"        %{self.listaTokens.push("if,"+"if"); return 'tk_if'; %}
"else"      %{self.listaTokens.push("else,"+"else"); return 'tk_else'; %}
"for"       %{self.listaTokens.push("for,"+"for");return 'tk_for'; %}
"while"     %{self.listaTokens.push("while,"+"while");return 'tk_while'; %}
"do"        %{self.listaTokens.push("do,"+"do");return 'tk_do'; %}
"class"     %{self.listaTokens.push("class,"+"class");return 'tk_class'; %}
"null"      %{self.listaTokens.push("null,"+"null");return 'tk_null'; %}
"delete"    %{self.listaTokens.push("delete,"+"delete");return 'tk_delete'; %}
"true"      %{self.listaTokens.push("true,"+"true");return 'tk_true'; %}
"false"     %{self.listaTokens.push("false,"+"false");return 'tk_false'; %}
"new"       %{self.listaTokens.push("new,"+"new");return 'tk_new'; %}
"void"      %{self.listaTokens.push("void,"+"void");return 'tk_void'; %}
"const"     %{self.listaTokens.push("const,"+"const");return 'tk_const'; %}
"case"      %{self.listaTokens.push("case,"+"case");return 'tk_case'; %}
"catch"     %{self.listaTokens.push("catch,"+"catch");return 'tk_catch'; %}
"try"       %{self.listaTokens.push("try,"+"try");return 'tk_try'; %}
"import"    %{self.listaTokens.push("import,"+"import");return 'tk_import'; %}
"extends"   %{self.listaTokens.push("extends,"+"extends");return 'tk_extends'; %}
"export"    %{self.listaTokens.push("export,"+"export");return 'tk_export'; %}
"finally"   %{self.listaTokens.push("finally,"+"finally");return 'tk_finally'; %}
"switch"    %{self.listaTokens.push("switch,"+"switch");return 'tk_switch'; %}
"this"      %{self.listaTokens.push("this,"+"this");return 'tk_this'; %}
"throw"     %{self.listaTokens.push("throw,"+"throw");return 'tk_throw'; %}
"static"    %{self.listaTokens.push("static,"+"static");return 'tk_static'; %}
"private"   %{self.listaTokens.push("private,"+"private");return 'tk_private'; %}
"public"    %{self.listaTokens.push("public,"+"public");return 'tk_public'; %}    
"protected" %{self.listaTokens.push("protected,"+"protected");return 'tk_protected'; %}
"interface" %{self.listaTokens.push("interface,"+"interface");return 'tk_interface'; %}
"int"       %{self.listaTokens.push("int,"+"int");return 'tk_int'; %}
"String"    %{self.listaTokens.push("string,"+"string");return 'tk_string'; %}
"boolean"   %{self.listaTokens.push("boolean,"+"boolean");return 'tk_boolean'; %}
"float"     %{self.listaTokens.push("float,"+"float");return 'tk_float'; %}
"char"      %{self.listaTokens.push("char,"+"char");return 'tk_char'; %}
"double"    %{self.listaTokens.push("double,"+"double");return 'tk_double'; %}
"System"    %{self.listaTokens.push("System,"+"System");return 'tk_system'; %}
"out"       %{self.listaTokens.push("out,"+"out");return 'tk_out'; %}
"println"   %{self.listaTokens.push("println,"+"println");return 'tk_println'; %}
"print"     %{self.listaTokens.push("print,"+"print");return 'tk_print'; %}
"package"   %{self.listaTokens.push("package,"+"package");return 'tk_package'; %}
"{"         %{self.listaTokens.push("LlaveIzq,"+yytext );return 'tk_llaveIzq'; %}
"}"         %{self.listaTokens.push("LlaveDer,"+yytext );return 'tk_llaveDer'; %}
";"     %{self.listaTokens.push("PuntoyComa,"+yytext );return 'tk_pyComa'; %}
","     %{self.listaTokens.push("coma,"+yytext );return 'tk_coma'; %}
"."     %{self.listaTokens.push("punto,"+yytext );return 'tk_punto'; %}
"("     %{self.listaTokens.push("ParentesisIzq,"+yytext );return 'tk_parenIzq'; %}
")"     %{self.listaTokens.push("ParentesisDer,"+yytext );return 'tk_parenDer'; %}
"*"    %{self.listaTokens.push("Asterisco,"+yytext );return 'tk_asterisco'; %}
"-"     %{self.listaTokens.push("Guion,"+yytext );return 'tk_guion'; %}
"%"     %{self.listaTokens.push("Porcentaje,"+yytext );return 'tk_porcentaje'; %}
"="     %{self.listaTokens.push("Asignacion,"+yytext );return 'tk_asignacion'; %}
"+"     %{self.listaTokens.push("Mas,"+yytext );return 'tk_mas'; %}
"<"     %{self.listaTokens.push("MenorQ,"+yytext );return 'tk_menorQ'; %}
">"     %{self.listaTokens.push("MayorQ,"+yytext );return 'tk_mayorQ'; %}
"&&"     %{self.listaTokens.push("And,"+yytext );return 'tk_and'; %}
"^"     %{self.listaTokens.push("Xor,"+yytext );return 'tk_xor'; %}
["||"]     %{self.listaTokens.push("Or,"+yytext );return 'tk_or'; %}
"!"     %{self.listaTokens.push("Admiracion,"+yytext );return 'tk_admiracion'; %}
"["   %{self.listaTokens.push("CorcheteIzq,"+yytext );return 'tk_corcheteIzq'; %}
"]"   %{self.listaTokens.push("CorcheteDer,"+yytext );return 'tk_corcheteDer'; %}
":"     %{self.listaTokens.push("Dpuntos,"+yytext );return 'tk_dPuntos'; %}


[0-9]+("."[0-9]+)?\b  %{self.listaTokens.push("Numero,"+yytext );return 'tk_numero'; %}
[a-zA-Z]([a-zA-Z0-9_])* %{self.listaTokens.push("Id,"+yytext ); return'tk_id'; %}

[/][/]([a-zA-Z0-9_ ])*[\n]*   %{yytext.substr(1,yyleng-2); self.listaTokens.push("ComentarioUni,"+yytext.substr(1,yyleng-2) ); %}
[/][*][^*]+[*]+([^/*]([a-zA-Z0-9_])*[^*]*[*]+)*[/] %{yytext.substr(1,yyleng-4) ;self.listaTokens.push("ComentarioMulti,"+yytext.substr(1,yyleng-2) ); %}

[\'][^\\\']*([\\][\\\'ntr][^\\\']*)*[\'] %{yytext.substr(1,yyleng-2);self.listaTokens.push("Cadena,"+yytext.substr(1,yyleng-2) );console.log(yytext); return 'tk_cadena'; %}
"/" %{self.listaTokens.push("Diagonal,"+yytext );return 'tk_Diagonal'; %}

[\t\n\r\f] %{ /*Se ignoran*/ %}
<<EOF>>     %{return 'EOF';%}
.           {console.log("Error Lexico: "+ yytext+", Fila: "+yylloc.first_line+", Columna: "+yylloc.first_column);self.erroresLex.push("Error Lexico: "+ yytext+", Fila: "+yylloc.first_line+", Columna: "+yylloc.first_column)}
/lex


/*----------------------Sintactico----------------*/

%start INICIO
%%

INICIO:ARCHIVOBIGIN EOF{  var auxTT=self.listaTokens; self.listaTokens=[];var auxTE=self.erroresLex; self.erroresLex=[]; 
     return { tabla_Tokens : auxTT, tabla_Errores : auxTE};}
	 |error EOF;

ARCHIVOBIGIN:IMPORTBIGIN
		|BIGINCOI
		|;
	
IMPORTBIGIN:tk_package PACKAGEBODY tk_pyComa 
		|tk_import PACKAGEBODY tk_pyComa 
		|;

PACKAGEBODY:tk_id PP tk_pyComa ;
PP:tk_punto PP 
	|tk_asterisco PP 
	|tk_id PP  
	|;

BIGINCOI: tk_public CI2 
    | error CI2
    |;

CI2:CLASSBIGIN BIGINCOI 
	|INTERFACEBIGIN BIGINCOI
	|error CI2 
	|;

CLASSBIGIN: tk_class tk_id tk_llaveIzq METODOS tk_llaveDer BIGINCOI 
    | error tk_llaveDer BIGINCOI;

INTERFACEBIGIN:tk_interface tk_id tk_llaveIzq CUERPOINT tk_llaveDer BIGINCOI 
    |tk_llaveIzq error tk_llaveDer BIGINCOI;
	
MAIN: tk_public tk_static tk_void tk_id tk_parenIzq TIPO tk_corcheteIzq tk_corcheteDer tk_id tk_parenDer tk_llaveIzq CUERPO tk_llaveDer 
    |error tk_llaveDer;



METODOS:MAIN METODOS 
        |MODIFICADOR TIPO tk_id METODOSP 
		|TIPO tk_id METODOSP 
		|;

METODOSP:tk_parenIzq PARAMETROS tk_parenDer tk_llaveIzq CUERPO tk_llaveDer METODOS 
		|tk_parenIzq error tk_parenDer tk_llaveIzq error tk_llaveDer METODOS 
        |tk_pyComa METODOS 
		|DECLARACIONP METODOS ;

CUERPOINT:MODIFICADOR TIPO tk_id tk_parenIzq PARAMETROS tk_parenDer tk_pyComa CUERPOINT
			|TIPO tk_id CUERPOINTP CUERPOINT 
			|;

CUERPOINTP:tk_parenIzq PARAMETROS tk_parenDer tk_pyComa 
			|tk_asignacion E tk_pyComa 
            | error tk_pyComa ;

PARAMETROS:TIPO tk_id PRPR 
			|;

PRPR:tk_coma PARAMETROS 
		|;

CUERPO:SIF CUERPO 
	|SFOR CUERPO 
	|SWHILE CUERPO 
	|SDOWHILE CUERPO 
    |METODOS CUERPO 
	|DECLARACION CUERPO 
	|ASIGNACION CUERPO 
	|IMPRIMIR CUERPO 
    |tk_id DD 
	|tk_break tk_pyComa 
	|tk_continue tk_pyComa 
	|tk_return RETURNCUE tk_pyComa 
	|error tk_pyComa
	|;

IMPRIMIR:tk_system tk_punto tk_out tk_punto PRINTTYPE tk_parenIzq IMPCUE tk_parenDer tk_pyComa 
    | tk_parenIzq error tk_parenDer tk_pyComa;

PRINTTYPE:tk_println 
		|tk_print ;

IMPCUE:tk_id IMPCUE 
        |tk_cadena IMPCUE 
		|E IMPCUE 
		|;
IMPCUEP:tk_cadena 
	|;
RETURNCUE:E RETURNCUE 
			|tk_cadena RETURNCUE 
			|tk_id RETURNCUE 
			|;

DD: ASIGNACION DD 
    |tk_pyComa DD 
    |;


DECLARACION:TIPO ASIGNACION DECLARACIONP ;

DECLARACIONP:tk_coma ASIGNACION DECLARACIONP 
    |;

ASIGNACION:tk_id ASIGNACION 
            |tk_asignacion ASIGP E ASIGNACION 
            |METODOSP 
            |;
ASIGP:tk_new tk_id tk_parenIzq PARAMETROS tk_parenDer tk_pyComa ASIGNACION 
		|;

SFOR:tk_for tk_parenIzq DECLARACION tk_pyComa EXP tk_pyComa EXP tk_parenDer tk_llaveIzq CUERPO tk_llaveDer ;

SWHILE:tk_while tk_parenIzq EXP tk_parenDer tk_llaveIzq CUERPO tk_llaveDer ;

SDOWHILE:tk_do tk_llaveIzq CUERPO tk_llaveDer tk_while tk_parenIzq EXP tk_parenDer tk_pyComa ;

SIF:tk_if tk_parenIzq EXP tk_parenDer tk_llaveIzq CUERPO tk_llaveDer ELSE ;
ELSE:tk_else ELSE2 
	|;
ELSE2:SIF 
	|tk_llaveIzq CUERPO tk_llaveDer 
	|;


EXP:tk_admiracion E  EXPP 
		| E  EXPP ;

EXPP:tk_and E 
	|tk_or tk_or E 
	|tk_xor E 
	|tk_mayorQ tk_asignacion E 
	|tk_menorQ tk_asignacion E 
	|tk_mayorQ E 
	|tk_menorQ E 
	|tk_asignacion tk_asignacion E 
	|tk_admiracion tk_asignacion E ;

E: T EP ;
EP: tk_mas T EP 
    | tk_guion T EP 
    | ;
T:F TP ;
TP: tk_asterisco F TP 
    | tk_Diagonal F TP 
    | ;
F: tk_numero E 
	|tk_guion F 
    |tk_true E 
    |tk_false E 
    |tk_id 
    |tk_coma E 
    |IMPCUEP E 
    |tk_parenIzq E tk_parenDer 
	||tk_parenIzq error tk_parenDer 
    |;

TIPO:tk_void 
	|tk_string 
	|tk_int 
	|tk_char  
	|tk_boolean 
	|tk_float   
	|tk_double 
    |;

MODIFICADOR:tk_public 
		|tk_private 
		|tk_protected 
		|;


