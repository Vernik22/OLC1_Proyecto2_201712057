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

![D](./imagenes/Grama1.png)
![D](./imagenes/Grama2.png)
![D](./imagenes/Grama3.png)
![D](./imagenes/Grama4.png)
![D](./imagenes/Grama5.png)
![D](./imagenes/Grama6.png)
![D](./imagenes/Grama7.png)
![D](./imagenes/Grama8.png)