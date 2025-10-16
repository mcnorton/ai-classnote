package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)

	log.Println("서버가 http://localhost:8000 에서 실행 중입니다...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
