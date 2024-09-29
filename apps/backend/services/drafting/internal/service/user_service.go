package service

import (
    "github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/model"
    "github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/database/repository/interface"
)

// UserService provides user-related services.
type UserService struct {
    userRepo repository.UserRepository
}

// NewUserService creates a new UserService with the given repository.
func NewUserService(repo repository.UserRepository) *UserService {
    return &UserService{userRepo: repo}
}

// CreateUser creates a new user.
func (s *UserService) CreateUser(user *model.User) error {
    return s.userRepo.CreateUser(user)
}