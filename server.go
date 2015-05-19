package main

import (
	"github.com/go-martini/martini"
	"github.com/martini-contrib/gzip"
	"log"
	"net/http"
	"path"
)

var m *martini.Martini

func init() {
	m = martini.New()
	router := martini.NewRouter()
	static := martini.Static("./src", martini.StaticOptions{ Fallback: "./src/index.html" })

	m.Use(martini.Recovery())
	m.Use(martini.Logger())
	m.Use(gzip.All())
	m.Use(static)

	router.NotFound(func(res http.ResponseWriter, req *http.Request) {
		if path.Ext(req.URL.Path) == "" {
			http.ServeFile(res, req, "./src/index.html")
		} else {
			res.WriteHeader(http.StatusNotFound)
		}
	})

	m.Action(router.Handle)
}

func main() {
	if err := http.ListenAndServe(":8000", m); err != nil {
		log.Fatal(err)
	}
}