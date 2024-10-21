package handler

import (
    "encoding/json"
    "net/http"

    "github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/model"
    "github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/service"
)

type UserHandler struct {
    userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
    return &UserHandler{userService: userService}
}

// CreateUser handles POST requests to create a new user
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var user model.User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    if err := h.userService.CreateUser(&user); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) Test(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode("Hello World!")
}