package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func index(w http.ResponseWriter, r *http.Request) {
	http.FileServer(http.Dir("public"))
}
func texto(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()
	archivo := r.PostForm.Get("archivo")
	log.Println(archivo)
	envioaJS(archivo)
	http.Redirect(w, r, "/", 302)
}
func envioaJS(envio string) {

	log.Println(envio)
}

func main() {
	//go get -u github.com/gorilla/mux

	r := mux.NewRouter()

	//r.HandleFunc("/", index).Methods("GET")
	r.HandleFunc("/prueba", texto).Methods("POST")

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
