package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func index(w http.ResponseWriter, r *http.Request) {
	http.FileServer(http.Dir("public"))
}

type Codigo struct {
	Nombre string
}
type People struct {
	Name    string `json:"name"`
	Age     int64  `json:"age"`
	IsAlive bool   `json:"isAlive"`
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
	log.Println(string(body) + "retorno del js")

}

func errPy(w http.ResponseWriter, r *http.Request) {
	fmt.Printf(r.FormValue("body"))
	r.ParseForm()
	var texto = r.PostForm.Get("body")

	log.Println(texto)

}

func main() {
	//go get -u github.com/gorilla/mux

	r := mux.NewRouter()

	//r.HandleFunc("/", index).Methods("GET")
	r.HandleFunc("/texto", envioaPY).Methods("POST")
	r.HandleFunc("/ErrPy", errPy).Methods("POST")

	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("public"))))
	log.Println("Escuchando en puerto8080...")
	log.Fatal(http.ListenAndServe(":8080", r))

	/*
		http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			fmt.Fprintf(w, "<h1>Hola Mundo</h1>")
		})
		http.ListenAndServe(":8080", nil)

		mux := http.NewServeMux()
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "<h1>Hola Mundo</h1>")
		})
		http.ListenAndServe(":8080", mux)
	*/

	//	mux := http.NewServeMux()
	//mux.NewRouter().StrinctSlash(true)
	//fs := http.FileServer(http.Dir("public"))

	//mux.HandleFunc("/", holaMundo)
	//mux.Handle("/", fs)

	//mux.HandleFunc("/", servirArchivos)

	//server := &http.Server{
	//		Addr:           ":8080",
	//	Handler:        mux,
	//		ReadTimeout:    10 * time.Second,
	//	WriteTimeout:   10 * time.Second,
	//		MaxHeaderBytes: 1 << 20,
	//	}
	//	log.Println("Escuchando...")
	//	log.Fatal(server.ListenAndServe())

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
