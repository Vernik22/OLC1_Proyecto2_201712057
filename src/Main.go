package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func holaMundo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>Hola Mundo</h1>")
}
func prueba(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "<h1>Hola Mundo desde usuario</h1>")
}

func main() {
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

	mux := http.NewServeMux()
	//mux.NewRouter().StrinctSlash(true)
	fs := http.FileServer(http.Dir("public"))

	//mux.HandleFunc("/", holaMundo)
	mux.Handle("/", fs)
	mux.HandleFunc("/usuario", prueba)

	server := &http.Server{
		Addr:           ":8080",
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	log.Println("Escuchando...")
	log.Fatal(server.ListenAndServe())
}
