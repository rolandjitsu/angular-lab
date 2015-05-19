package main

import (
	"net/http"
	"path"
	"github.com/go-martini/martini"
)

var m *martini.Martini

func init() {
	m = martini.New()
	router := martini.NewRouter()

	m.Use(martini.Recovery())
	m.Use(martini.Logger())
	m.Use(martini.Static("./src"))

	router.NotFound(func(writer http.ResponseWriter, request *http.Request) {
		if path.Ext(request.URL.Path) == "" {
			http.ServeFile(writer, request, "./src/index.html")
		} else {
			writer.WriteHeader(http.StatusNotFound)
			writer.Write([]byte("404"))
		}
	})

	m.Action(router.Handle)
}

func main() {
	m.Run()
}