package main

import (
	"log"
	"net/http"
	"encoding/json"

	"github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/api/router"
	"github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/database"
	"github.com/go-chi/chi"
	"github.com/joho/godotenv"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }
	if err := database.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
    if err := database.InitializePostgresDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	userRouter := router.NewUserRouter()

	r := chi.NewRouter()

	r.Mount("/api/v1", userRouter)
	r.Get("/", welcome)

	log.Println("Starting server")
    if err := http.ListenAndServe(":8080", r); err != nil {
        log.Fatalf("could not start server: %v", err)
    }
}

func welcome(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "DraftBash Direct Message Service"})
}