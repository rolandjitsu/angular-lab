package main

import (
	"github.com/go-martini/martini"
	"github.com/martini-contrib/gzip"
	"bytes"
	"log"
	"net/http"
	"path"
)

const STATIC_FILES_PATH string = "./"
const APP_PATH string = "./app"

var m *martini.Martini

func init() {
	m = martini.New()
	router := martini.NewRouter()
	static := martini.Static(STATIC_FILES_PATH)

	m.Use(martini.Recovery())
	m.Use(martini.Logger())
	m.Use(gzip.All())
	m.Use(static)

	router.NotFound(func(res http.ResponseWriter, req *http.Request) {
		if path.Ext(req.URL.Path) == "" {
			http.ServeFile(res, req, ConcatStrings(APP_PATH, "/index.html"))
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

func ConcatStrings(strings ...string) string {
	var buffer bytes.Buffer
	length := len(strings)
	if length == 0 {
		return ""
	}
	for i := 0; i < length; i++ {
		buffer.WriteString(strings[i])
	}
	return buffer.String()
}