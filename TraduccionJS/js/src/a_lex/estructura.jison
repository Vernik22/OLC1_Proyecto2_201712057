
%{
    const Nodo_Arbol= require('../Gramatica/nodoArbol.ts');
    
    let listaTokens="";
    var erroresLex="";
    var erroresSin=[];

    this.listaTokens="";
    this.erroresLex=[];
    this.erroresSin=[];
%}

/*------------------- Lexico-----------------*/

%lex
%options case-sensitive
%%

\s+         /*Omitir espacios en blanco*/
"continue"  %{return 'tk_continue'; %}
"break"     %{ return 'tk_break'; %}
"return"    %{ return 'tk_return'; %}
"if"        %{ return 'tk_if'; %}
"else"      %{ return 'tk_else'; %}
"for"       %{return 'tk_for'; %}
"while"     %{return 'tk_while'; %}
"do"        %{return 'tk_do'; %}
"class"     %{return 'tk_class'; %}
"null"      %{return 'tk_null'; %}
"delete"    %{return 'tk_delete'; %}
"true"      %{return 'tk_true'; %}
"false"     %{return 'tk_false'; %}
"new"       %{;return 'tk_new'; %}
"void"      %{return 'tk_void'; %}
"const"     %{return 'tk_const'; %}
"case"      %{return 'tk_case'; %}
"catch"     %{return 'tk_catch'; %}
"try"       %{return 'tk_try'; %}
"import"    %{return 'tk_import'; %}
"extends"   %{return 'tk_extends'; %}
"export"    %{return 'tk_export'; %}
"finally"   %{return 'tk_finally'; %}
"switch"    %{return 'tk_switch'; %}
"this"      %{return 'tk_this'; %}
"throw"     %{return 'tk_throw'; %}
"static"    %{return 'tk_static'; %}
"private"   %{return 'tk_private'; %}
"public"    %{return 'tk_public'; %}    
"protected" %{return 'tk_protected'; %}
"interface" %{return 'tk_interface'; %}
"int"       %{return 'tk_int'; %}
"String"    %{return 'tk_string'; %}
"boolean"   %{return 'tk_boolean'; %}
"float"     %{return 'tk_float'; %}
"char"      %{return 'tk_char'; %}
"double"    %{return 'tk_double'; %}
"System"    %{return 'tk_system'; %}
"out"       %{return 'tk_out'; %}
"println"   %{return 'tk_println'; %}
"print"     %{return 'tk_print'; %}
"package"   %{return 'tk_package'; %}
"{"         %{return 'tk_llaveIzq'; %}
"}"         %{return 'tk_llaveDer'; %}
";"     %{return 'tk_pyComa'; %}
","     %{return 'tk_coma'; %}
"."     %{return 'tk_punto'; %}
"("     %{return 'tk_parenIzq'; %}
")"     %{return 'tk_parenDer'; %}
"*"     %{return 'tk_asterisco'; %}
"-"     %{return 'tk_guion'; %}
"%"     %{return 'tk_porcentaje'; %}
"="     %{return 'tk_asignacion'; %}
"+"     %{return 'tk_mas'; %}
"<"     %{return 'tk_menorQ'; %}
">"     %{return 'tk_mayorQ'; %}
"&&"     %{return 'tk_and'; %}
"^"     %{return 'tk_xor'; %}
"||"     %{return 'tk_or'; %}
"!"     %{return 'tk_admiracion'; %}
"["   %{return 'tk_corcheteIzq'; %}
"]"   %{return 'tk_corcheteDer'; %}
":"     %{return 'tk_dPuntos'; %}


[0-9]+("."[0-9]+)?\b  %{return 'tk_numero'; %}
[a-zA-Z]([a-zA-Z0-9_])* %{ return'tk_id'; %}
"//"[\n]*   %{yytext.substr(1,yyleng-2); this.listaTokens.push('tk_comentarioUni');return 'tk_comentarioUni'; %}
[/][*][^*]+[*]+([^/*][^*]*[*]+)*[/] %{yytext.substr(1,yyleng-2) ;return 'tk_comentarioMulti'; %}
[\"][^\\\"]*([\\][\\\"ntr][^\\\"]*)*[\"] %{yytext.substr(1,yyleng-2); return 'tk_cadena'; %}

"/" %{return 'tk_Diagonal'; %}

[\t\n\r\f] %{ /*Se ignoran*/ %}
<<EOF>>     %{return 'EOF';%}
.           {console.log("Error Lexico: "+ yytext+", Fila: "+yylloc.first_line+", Columna: "+yylloc.first_column);}
/lex


/*----------------------Sintactico----------------*/

%start INICIO
%%

INICIO: ARCHIVOBIGIN EOF{return this.listaTokens;};

ARCHIVOBIGIN: IMPORTBIGIN
    | BIGINCOI
    | ;

IMPORTBIGIN: tk_package tk_pyComa 
    | tk_import tk_pyComa
    | ;

BIGINCOI:  tk_public CI2 {this.listaTokens+=$1+$2}
    |;

CI2: CLASSBIGIN BIGINCOI
    | INTERFACEBIGIN BIGINCOI
    | ;

CLASSBIGIN: tk_class tk_id tk_llaveIzq tk_llaveDer BIGINCOI {$$+=$1+$2+$3};

INTERFACEBIGIN: ;