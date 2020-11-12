

var contador = 0;
function get_cont() {
    return contador++;
}

var vent_focus = "pestana1";
function get_vent() {
    return vent_focus;
}

function set_vent(vent) {
    vent_focus = vent;
}

var lista = new Array();
function linkedlist(pestana, nombre) {
    var obj = new Object();
    obj.pestana = pestana;
    obj.nombre = nombre;
    lista.push(obj);
}

function deletepes(pestana) {
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].pestana == pestana) {
            delete lista[i];
        }
    }
}

/*--------------------------------------Funcion Al Cambiar Ventana---------------------------------------*/
function index(pestanias, pestania) {
    var id = pestania.replace('pestana', '');
    set_vent('textarea' + id);

    var pestanna1 = document.getElementById(pestania);
    var listaPestannas = document.getElementById(pestanias);
    var cpestanna = document.getElementById('c' + pestania);
    var listacPestannas = document.getElementById('contenido' + pestanias);

    var i = 0;
    while (typeof listacPestannas.getElementsByTagName('div')[i] != 'undefined') {
        $(document).ready(function () {
            $(listacPestannas.getElementsByTagName('div')[i]).css('display', 'none');
            $(listaPestannas.getElementsByTagName('li')[i]).css('background', '');
            $(listaPestannas.getElementsByTagName('li')[i]).css('padding-bottom', '');
        });
        i += 1;
    }

    $(document).ready(function () {
        $(cpestanna).css('display', '');
        $(pestanna1).css('background', 'dimgray');
        $(pestanna1).css('padding-bottom', '2px');
    });

    try {
        var act = document.getElementById('cpestana' + id);
        var tact = document.getElementById('textarea' + id);

        while (act.firstChild) {
            act.removeChild(act.firstChild);
        }

        act.appendChild(tact);
        var editor = CodeMirror(act, {
            lineNumbers: true,
            value: tact.value,
            matchBrackets: true,
            styleActiveLine: true,
            theme: "eclipse",
            mode: "text/x-java"
        }).on('change', editor => {
            tact.value = editor.getValue();
        });
    } catch (error) { }
}

/*---------------------------------------Funcion Agregar Pestania----------------------------------------*/
function agregar() {
    var x = get_cont();
    var lu = document.getElementById("lista");
    var li = document.createElement("li");
    li.setAttribute('id', 'pestana' + x);
    var a = document.createElement("a");
    a.setAttribute('id', 'a' + x);
    a.setAttribute('href', 'javascript:index("pestanas","pestana' + x + '")');
    a.text = 'pestana' + x;
    li.appendChild(a);
    lu.appendChild(li);
    index("pestanas", "pestana" + x);

    var contenido = document.getElementById("contenidopestanas");
    var divp = document.createElement("div");
    divp.setAttribute('id', 'cpestana' + x);
    var ta = document.createElement("textarea");
    ta.setAttribute('id', 'textarea' + x);
    ta.setAttribute('name', 'textarea' + x);
    ta.setAttribute('class', 'ta');
    ta.setAttribute('style', 'display:none');
    ta.cols = 123;
    ta.rows = 30;
    divp.appendChild(ta);
    contenido.appendChild(divp);

    var act = document.getElementById('cpestana' + x);
    var tact = document.getElementById('textarea' + x);
    var editor = CodeMirror(act, {
        lineNumbers: true,
        value: tact.value,
        matchBrackets: true,
        styleActiveLine: true,
        theme: "eclipse",
        mode: "text/x-java"
    }).on('change', editor => {
        tact.value = editor.getValue();
    });
}

function quitar() {
    try {
        var lu = document.getElementById("lista");
        lu.removeChild(document.getElementById(get_vent().replace("textarea", "pestana")));
        var contenido = document.getElementById("contenidopestanas");
        contenido.removeChild(document.getElementById(get_vent().replace("textarea", "cpestana")));
        deletepes(get_vent());
    } catch (error) { }
}


/*-----------------------------------------------File---------------------------------------------------*/
function AbrirArchivo(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var act = document.getElementById("textarea0");
        var tact = document.getElementById("textarea0");
        tact.value = e.target.result;

        while (act.firstChild) {
            act.removeChild(act.firstChild);
        }

        act.appendChild(tact);
        var editor = CodeMirror(act, {
            lineNumbers: true,
            value: tact.value,
            matchBrackets: true,
            styleActiveLine: true,
            theme: "eclipse",
            mode: "text/x-java"
        }).on('change', editor => {
            tact.value = editor.getValue();
        });
    };
    reader.readAsText(file);
    file.clear;

    var a = document.getElementById("textarea0");
    a.text = file.name;
    linkedlist(get_vent(), file.name);

    var file_input = document.getElementById("fileInput");
    document.getElementById('fileInput').value = "";
}

function DescargarArchivo() {
    var ta = document.getElementById("textarea0");
    var contenido = ta.value;//texto de vent actual

    //formato para guardar el archivo
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();
    var HH = hoy.getHours();
    var MM = hoy.getMinutes();
    var formato = get_vent().replace("textarea", "") + "_" + dd + "_" + mm + "_" + yyyy + "_" + HH + "_" + MM;

    var nombre = "Archivo" + formato + ".java";//nombre del archivo
    var file = new Blob([contenido], { type: 'text/plain' });

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, nombre);
    } else {
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

/* *-------------------------------------*TRADUCCION--------------------*/


function traducir() {

    console.log("traducir");

    var form = new FormData(document.getElementById('myForm'));
    fetch("../texto", {
        method: "POST",
        body: form
    });
    var form = new FormData(document.getElementById('myForm'));
    fetch("../textoj", {
        method: "POST",
        body: form
    });
    console.log(form);
    Reportes();
    ReportesJs();
    console.log("paso");
}

//--------------------------------Obtener errores------------------------------

async function Reportes() {
    console.log("Reportes");
    let url = new URL("http://localhost:8080/TradPy");
    //const params = {gender: "female", nat:"US"};
    //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    };
    let response = await fetch(url, dataRequest);
    console.log(response)
    let result = await response.json();
    console.log(result)
    var ErroresLex = JSON.stringify(result.Errores);
    var ErroresSin = JSON.stringify(result.ErroresSin);
    var Tokens = JSON.stringify(result.Tokens);
    var Trad = JSON.stringify(result.Traduccion);
    var Grafo = JSON.stringify(result.Grafo);
    document.getElementById("conPT").value += "------------------------Erores Lexicos-------------------------\n";
    document.getElementById("conPT").value += ErroresLex + "\n";
    document.getElementById("conPT").value += "----------------------Erores Sintacticos-----------------------\n";
    document.getElementById("conPT").value += ErroresSin + "\n";
    document.getElementById("conPT").value += "-----------------------------Tokens---------------------------\n";
    document.getElementById("conPT").value += Tokens + "\n";
    document.getElementById("conPT").value += "--------------------------Traduccion-------------------------\n";
    document.getElementById("conPT").value += result.Traduccion + "\n";


    //----------------------------------Ingresar a tablas ----------------------------------------------------------------
    var Table = document.getElementById("TablaErrores");
    Table.innerHTML = "";
    var graf = document.getElementById("grafica");
    graf.innerHTML = "";
    ErroresLex = JSON.parse(JSON.stringify(result.Errores));
    ErroresSin = JSON.parse(JSON.stringify(result.ErroresSin));
    Tokens = JSON.parse(JSON.stringify(result.Tokens));
    $("#TablaErrores").append('<tr><td>No.</td>' +
        '<td>Tipo</td>' +
        '<td>Fila</td>' +
        '<td>Columna</td>' +
        '<td>Descripcion</td>');
    for (i = 0; i < ErroresLex.length; i++) {

        $("#TablaErrores").append('<tr>' +
            '<td align="center" style="dislay: none;">' + (i + 1) + '</td>' +
            '<td align="center" style="dislay: none;">' + "Léxico" + '</td>' +
            '<td align="center" style="dislay: none;">' + ErroresLex[i].fila + '</td>' +
            '<td align="center" style="dislay: none;">' + ErroresLex[i].columna + '</td>' +
            '<td align="center" style="dislay: none;">' + ErroresLex[i].lexema + " no pertenece al lenguaje" + '</td>' + '</tr>');
    }

    for (i = 0; i < ErroresSin.length; i++) {

        $("#TablaErrores").append('<tr>' +
            '<td align="center" style="dislay: none;">' + (i + 1) + '</td>' +
            '<td align="center" style="dislay: none;">' + "Sintactico" + '</td>' +
            '<td align="center" style="dislay: none;">' + "Fila" + '</td>' +
            '<td align="center" style="dislay: none;">' + "Columna" + '</td>' +
            '<td align="center" style="dislay: none;">' + ErroresSin[i] + '</td>' + '</tr>');
    }
    //-------------------------------------------------------------------------------------------------
    var Tok = document.getElementById("TablaTokens");
    Tok.innerHTML = "";
    $("#TablaTokens").append('<tr><td>No.</td>' +
        '<td>Fila</td>' +
        '<td>Columna</td>' +
        '<td>Tipo</td>' +
        '<td>Descripcion</td>');
    for (i = 0; i < Tokens.length; i++) {

        $("#TablaTokens").append('<tr>' +
            '<td align="center" style="dislay: none;">' + (i + 1) + '</td>' +
            '<td align="center" style="dislay: none;">' + "Fila" + '</td>' +
            '<td align="center" style="dislay: none;">' + "Columna" + '</td>' +
            '<td align="center" style="dislay: none;">' + Tokens[i].token + '</td>' +
            '<td align="center" style="dislay: none;">' + Tokens[i].lexema + '</td>' + '</tr>');
    }

    //------------------------------------------------------------------------------------

    console.log("grafica")
    d3.select("#grafica").graphviz()
        .width(2000)
        .height(2100)
        .fit(true)
        .renderDot("digraph  G{" + result.Grafo + "}");

    d3.select("#GrafJs").graphviz()
        .width(2000)
        .height(2100)
        .fit(true)
        .renderDot("digraph  G{" + result.Grafo + "}");

}

async function ReportesJs() {
    console.log("ReportesJS");
    let url = new URL("http://localhost:8080/TradJs");
    //const params = {gender: "female", nat:"US"};
    //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    };
    let response = await fetch(url, dataRequest);
    console.log(response)
    let result = await response.json();
    console.log(result)
    var ErroresLex = JSON.stringify(result.Errores);
    var ErroresSin = JSON.stringify(result.ErroresSin);
    var Tokens = JSON.stringify(result.Tokens);
    var Trad = JSON.stringify(result.Traduccion);
    var Grafo = JSON.stringify(result.Grafo);
    document.getElementById("conJS").value += "------------------------Erores Lexicos-------------------------\n";
    document.getElementById("conJS").value += ErroresLex + "\n";
    document.getElementById("conJS").value += "----------------------Erores Sintacticos-----------------------\n";
    document.getElementById("conJS").value += ErroresSin + "\n";
    document.getElementById("conJS").value += "-----------------------------Tokens---------------------------\n";
    document.getElementById("conJS").value += Tokens + "\n";
    document.getElementById("conJS").value += "--------------------------Traduccion-------------------------\n";
    document.getElementById("conJS").value += result.Traduccion + "\n";
    //result.Traduccion


    console.log("grafica")
    /*
    d3.select("#GrafJs").graphviz()
    .width(2000)
    .height(2100)
    .fit(true)
    .renderDot("digraph  G{"+result.Grafo+"}");  
  */
}
async function GuardarJs() {
    console.log("GuardarJs")
    let url1 = new URL("http://localhost:8080/TradJs");
    //const params = {gender: "female", nat:"US"};
    //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    };
    let response = await fetch(url1, dataRequest);
    console.log(response)
    let result = await response.json();
    //var ta=document.getElementById("textarea0");
    var contenido = result.Traduccion;//texto de vent actual

    //formato para guardar el archivo
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();
    var HH = hoy.getHours();
    var MM = hoy.getMinutes();
    var formato = get_vent().replace("textarea", "") + "_" + dd + "_" + mm + "_" + yyyy + "_" + HH + "_" + MM;

    var nombre = "Traduccion" + formato + ".js";//nombre del archivo
    var file = new Blob([contenido], { type: 'text/plain' });

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, nombre);
    } else {
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

async function GuardarPy() {
    let url1 = new URL("http://localhost:8080/TradPy");
    //const params = {gender: "female", nat:"US"};
    //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const dataRequest = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    };
    let response = await fetch(url1, dataRequest);
    console.log(response)
    let result = await response.json();
    //var ta=document.getElementById("textarea0");
    var contenido = result.Traduccion;//texto de vent actual

    //formato para guardar el archivo
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();
    var HH = hoy.getHours();
    var MM = hoy.getMinutes();
    var formato = get_vent().replace("textarea", "") + "_" + dd + "_" + mm + "_" + yyyy + "_" + HH + "_" + MM;

    var nombre = "Traduccion" + formato + ".py";//nombre del archivo
    var file = new Blob([contenido], { type: 'text/plain' });

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, nombre);
    } else {
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

