package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

func index(w http.ResponseWriter, r *http.Request) {
	http.FileServer(http.Dir("public"))
}

type Codigo struct {
	Nombre string
}
type TraduccionPy struct {
	Errores    []string
	Tokens     []string
	ErroresSin []string
	Traduccion string
}

func texto(w http.ResponseWriter, r *http.Request) {
	var url = "http://localhost:3000/traduccion/recibir"
	var decoder = json.NewDecoder(r.Body)
	var c Codigo
	err := decoder.Decode(&c)
	log.Println(c.Nombre)
	if err != nil {
		panic(err)
	}

	var jsonStr = []byte(`{"Nombre":"` + c.Nombre + `"}`)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	fmt.Println(string(bodyBytes))
	fmt.Fprintf(w, string(bodyBytes))
	log.Println(decoder)
}
func envioaPY(w http.ResponseWriter, r *http.Request) {
	fmt.Printf(r.FormValue("textarea0"))
	r.ParseForm()
	var texto = r.PostForm.Get("textarea0")

	log.Println(texto)

	//var url = "http://Py:3000/traduccion/recibir"
	var url = "http://localhost:3000/traduccion/recibir"

	requestBody, err := json.Marshal(map[string]string{
		"Nombre": texto,
	})

	if err != nil {
		log.Fatal(err)
	}
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(body))

}

func errPy(w http.ResponseWriter, r *http.Request) {
	//var url = "http://Py:3000/traduccion/tradPy"
	var url = "http://localhost:3000/traduccion/tradPy"

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(body))
	fmt.Fprintf(w, string(body))

	bytes := []byte(body)

	var colores map[string]interface{}
	//m := colores.()

	if err := json.Unmarshal(bytes, &colores); err != nil {
		panic(err)
	}
	fmt.Println(colores)
	entries := strings.Split(string(body), "token")
	fmt.Println(entries[0])

}

//--------------------------------------------------------------------------------------------

func errPySin(w http.ResponseWriter, r *http.Request) {
	//var url = "http://Py:3000/traduccion/Esin"
	var url = "http://localhost:3000/traduccion/Esin"

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(body))
	fmt.Fprintf(w, string(body))

}
func tokens(w http.ResponseWriter, r *http.Request) {
	//var url = "http://Py:3000/traduccion/Tokens"
	var url = "http://localhost:3000/traduccion/Tokens"

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(body))
	fmt.Fprintf(w, string(body))

}
func cTraducido(w http.ResponseWriter, r *http.Request) {
	//var url = "http://Py:3000/traduccion/Ctraducido"
	var url = "http://localhost:3000/traduccion/Ctraducido"

	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(body))
	fmt.Fprintf(w, string(body))

}

func main() {
	//go get -u github.com/gorilla/mux

	r := mux.NewRouter()

	//r.HandleFunc("/", index).Methods("GET")
	r.HandleFunc("/texto", envioaPY).Methods("POST")
	r.HandleFunc("/TradPy", errPy)

	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("public"))))
	log.Println("Escuchando en puerto8080...")
	log.Fatal(http.ListenAndServe(":8080", r))

}

func servirArchivos(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		path := r.URL.Path

		if path == "/" {
			path = "./public/index.html"
		} else {
			path = "" + path
		}
		http.ServeFile(w, r, "./public/index.html")
	case "POST":
		r.ParseMultipartForm(0)
		text := r.FormValue("archivo")
		log.Println(text)
	default:
		fmt.Fprintf(w, "Request type other than GET or POST")
	}

}
