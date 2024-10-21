package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/database"
	"github.com/DraftBash/draftbash/apps/backend/services/direct-message-service/internal/model"
)

// PostgresUserRepository is an implementation of the UserRepository interface
type PostgresUserRepository struct {}

// CreateUser inserts a new user into the database and returns the user's ID
func (r *PostgresUserRepository) CreateUser(user *model.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	query := `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`
	err := database.PostgresDB.QueryRowContext(ctx, query, user.Name, user.Email, user.Password).Scan(&user.ID)
	if err != nil {
		return fmt.Errorf("could not insert user: %w", err)
	}
	return nil
}