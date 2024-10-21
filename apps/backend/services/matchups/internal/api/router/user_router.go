package router

import (
    "github.com/go-chi/chi"
    "github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/api/handler"
	"github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/service"
	"github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/database/repository/postgres"
)

func NewUserRouter() chi.Router {
	// Instantiate the repository
	userRepo := &repository.PostgresUserRepository{}

	// Instantiate the service with the repository
    userService := service.NewUserService(userRepo)

	// Instantiate the service with the repository
    r := chi.NewRouter()
    userHandler := handler.NewUserHandler(userService)

    // Define routes
    r.Post("/users", userHandler.CreateUser)

    r.Get("/test", userHandler.Test)

    return r
}