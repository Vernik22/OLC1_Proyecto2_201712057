# Manual Técnico
Esta aplicacion fue elaborada por dos lenguajes, el primer lenguaje utilizado fue golang con el cual se construyo la parte de front-end, es decir la parte que vera el usuario.
El segundo lenguaje utilizado fue javascript junto con typescript, estos dos lenguajes se utlizaron para la parte del back-end, es decir toda la parte logica y de analisis de toda la aplicacion.
Todo esto fue encapsulado en contenedores utilizando la herramienta dockerhub.

### Cliente
Para la parte del cliente se utilizo el lenguaje golang para poder crear el servidor y que el usuario vea la interfaz grafica, siendo servido en el puerto :8080

![D](./imagenes/Cliente.png)

### Analisis
Para el analisis de esta aplicacion se utilizo un analizador lexico y un analizador sintactico, luego de esto se procede a traducir si no se encuentran errores en el analisis sintactico

#### Analisis Léxico
Se utilizó el siguiente AFD para conseguir el analisis léxico exitoso utilizando metodos y una lista para los tokens que se reconocieron correctamente.

![D](./imagenes/Alex.png)

Se utilizo la siguiente estructura de clases para poder guardar correctamente los tokens reconocidos y los posibles errores que se fueran encontrando.

![D](./imagenes/Alex1.png)

También se hizo uso de una libreria Enum para enumerar cada uno de los lexemas validos en nuestro lenguaje a Analizar, osea java.

![D](./imagenes/Alex2.png)

Para la elaboracion del analizador lexico se utilizaron metodos los cuales llevaron un orden segun nuestro AFD para poder analizar de manera correcta el lenguaje.

![D](./imagenes/Alex3.png)

Los tokens reconocidos correctamente se fueron almacenando en una lista, una lista de tokens la cual se mandaba como parametro al analizador sintactico.

#### Analisis Sintactico
Para el analisis sintactico se utilizo una gramatica, en su mayoria recursiva por la derecha, esto para evitar la ambiguedad y la recursividad por la izquierda la cual no es recomendable para estos proyectos. 
La gramatica utilizada fue la siguiente:


```sh
GRAMATICA
<INICIO>:= <ARCHIVOBIGIN>

<ARCHIVOBIGIN>:=<IMPORTBIGIN>
		|<BIGINCOI>
		|epsilon
	
<IMPORTBIGIN>:=<package><PACKAGEBODY><puntoycoma>
		|<import><PACKAGEBODY><puntoycoma>
		|<epsiolon>

<PACKAGEBODY>:=<id><PP><puntoycoma>
<PP>:=<punto><PP>
	|<asterisco><PP>
	|<id><PP>
	|<epsilon>

<BIGINCOI>:=<public><CI2>

<CI2>:=<CLASSBIGIN><BIGINCOI>
	|<INTERFACEBIGIN><BIGINCOI>
	|<epsilon>

<CLASSBIGIN>:=<class><nombre><llaveiz><METODOS><llaveder><BIGINCOI>

<INTERFACEBIGIN>:=<interface><nombre><llaveiz><CUERPOINT><llaveder><BIGINCOI>
	
<MAIN>:=<public><static><void><main><parentesis(><TIPO><corchete[><corchete]><nombre><parentesis)><CUERPO>

<IMPRIMIR>:=<system><punto><out><punto><PRINTTYPE><parentesisiz><IMPCUE><parentesisder><puntoycoma>

<PRINTTYPE>:=<println>
		|<print>

<IMPCUE>:=<comillas><IMPCUEP><comillas><IMPCUE>
		|<comillasimple><cadena><comillasimple><IMPCUE>
		|<id><IMPCUE>
		|<E><IMPCUE>
		|<epsilon>

<IMPCUEP>:=<cadena>
		|<epsilon>

<METODOS>:=<MODIFICADOR><TIPO><nombre><METODOSP>
		|<TIPO><nombre><METODOSP>
		|<MAIN><METODOS>
		|<epsilon>

<METODOSP>:=<parentesisiz><PARAMETROS><parentesisder><llaveiz><CUERPO><llaveder><METODOS>
		|<DECLARACIONP><METODOS>

<CUERPOINT>:=<MODIFICADOR><TIPO><id><parentesisiz><PARAMETROS><parentesisder><puntoycoma><CUERPOINT>
			|<TIPO><id><CUERPOINTP><CUERPOINT>
			|<epsilon>

<CUERPOINTP>:=<parentesisiz><PARAMETROS><parentesisder><puntoycoma>
			|<asignacion><E><puntoycoma>

<PARAMETROS>:=<TIPO><id><PRPR>
			|epsilon

<PRPR>:=<coma><PARAMETROS>
		|epsilon

<CUERPO>:=<SIF><CUERPO>
	|<SFOR><CUERPO>
	|<SWHILE><CUERPO>
	|<SDOWHILE><CUERPO>
	|<DECLARACION><CUERPO>
	|<ASIGNACION><CUERPO>
	|<IMPRIMIR><CUERPO>
	|<break><puntoycoma>
	|<continue><puntoycoma>
	|<return><RETURNCUE><puntoycoma>
	|<epsilon>

<RETURNCUE>:=<E><RETURNCUE>
			|<comillas><cadena><comillas><RETURNCUE>
			|<id><RETURNCUE>
			|<epsilon>

<DECLARACION>:=<TIPO><ASIGNACION><DECLARACIONP><puntoycoma>
<DECLARACIONP>:=<coma><ASIGNACION><DECLARACIONP>

<ASIGNACION>:=<nombre><ASIGNACION>
            |<=><ASIGP><E>
            |<punto y coma>
<ASIGP>:=<new><id><parentesisiz><PARAMETROS><parentesisder><puntoycoma><ASIGNACION>
		|<epsilon>

<SFOR>:=<for><parentesisiz><DECLARACION><puntoycoma><EXP><puntoycoma><EXP><parentesisder><llaveiz><CUERPO><llaveder>

<SWHILE>:=<while><parentesisiz><EXP><parentesisder><llaveiz><CUERPO><llaveder>

<SDOHILE>:=<do><llaveiz><CUERPO><llaveder><while><parentesisiz><EXP><parentesisder><puntoycoma>

<SIF>:=<if><parentesisiz><EXP><parentesisder><llaveiz><CUERPO><llaveder><ELSE>
<ELSE>:=<else><ELSE2>
	|<epsilon>
<ELSE2>:=<SIF>
	|<llaveiz><CUERPO><llaveder>
	|<epsilon>


<EXP>:=<admiracion><E><EXPP>
		|<E><EXPP>

<EXPP>:=<and><and><E>
	|<or><or><E>
	|<xor><E>
	|<mayorque><asignacion><E>
	|<menorque><asignacion><E>
	|<mayorque><E>
	|<menorque><E>
	|<asignacion><asignacion><E>
	|<admiracion><asignacion><E>

E-> T EP
EP-> + T EP
    | - T EP
    | EPSILON
T->F TP
TP-> * F TP
    | / F TP
    | EPSILON
F->  (E)
	| NUMERO
	|negativo(-) F	

<BREAK>:=
<CONTINUE>:=
<RETURN>:=

<TIPO>:=<void>
	|<string>
	|<int>
	|<char>
	|<bool>
	|<float>
	|<double>

<MODIFICADOR>:=<public>
		|<private>
		|<protected>
		|<epsilon>


<EXP>:=<E><and><and><E>
	|<E><or><or><E>
	|<admiracion><admiracion><E>
	|<E><xor><E>
	|<E><mayorque><E>
	|<E><menorque><E>
	|<E><mayorque><asignacion><E>
	|<E><menorque><asignacion><E>
	|<E><asignacion><asignacion><E>
	|<E><admiracion><asignacion><E>
```

Para implementar esta gramatica de igual manera se utilizaron metodos los cuales seguian la sintaxis de la gramatica antes definida.

![D](./imagenes/Sint1.png)

Se utilizo un metodo llamado "emparejar" para indicar que es un terminal y ha llegado a cierta sintaxis.

![D](./imagenes/Sint2.png)

Asi mismo se implementa en este mismo metodo la recuperacion de errores con algun terminal como por ejemplo un punto y coma o una llave derecha, estos dos fueron los simbolos utilizados para recuperacion de errores.

#### Traducción 
Para la traducción se implemento un metodo en el cual se iba verificando que token era el siguiente, esto debido a que ya ha sido analizado y solo se traduce si el codigo es correcto, si el codigo contiene errores sintacticos el codigo no es traducido.

![D](./imagenes/Trad.png)

Se van verificando los tokens siguientes y asi concatenando y generando la traduccion.