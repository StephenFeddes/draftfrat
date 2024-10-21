package repository

import (
	"github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/model"
)

type UserRepository interface {
	CreateUser(user *model.User) error
}