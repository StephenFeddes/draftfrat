package database

import (
	"database/sql"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

// Global variable for the database connection
var PostgresDB *sql.DB

// InitializeDB initializes the database connection and sets the global DB variable
func InitializePostgresDB() error {
    connStr := os.Getenv("DATABASE_URL")
    var err error
    PostgresDB, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatalf("Unable to connect to database: %v\n", err)
		return err
    }
	return nil
}

func RunMigrations() error {
	// Replace with your actual database URL
	databaseURL := os.Getenv("DATABASE_URL")

	// Path to migration files
	migrationsPath := "file://migrations"

	m, err := migrate.New(migrationsPath, databaseURL)
	if err != nil {
		log.Fatalf("Failed to create migrate instance: %v", err)
		return err
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Migration failed: %v", err)
		return err
	}

	log.Println("Migrations ran successfully")
	return nil
}