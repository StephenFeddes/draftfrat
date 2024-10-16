# Random password generator for the database user
resource "random_password" "pg_password" {
  length  = 16
  special = true
  override_special = "_%@"
}

# Create a Neon Project
resource "neon_project" "default" {
  name = "DraftFratProject"
  region = "us-east-1"
}

# Create a Neon Database in the project
resource "neon_project_database" "users_db" {
  project_id = neon_project.default.id
  name       = "users"
}

# Create a Neon Role (database user) and assign the generated password
resource "neon_project_role" "db_user" {
  project_id = neon_project.default.id
  name       = "draftfrat_user"
  password   = random_password.pg_password.result
}

# Output the connection string with the generated username and password
output "postgres_connection_string" {
  value = "postgresql://${neon_project_role.db_user.name}:${random_password.pg_password.result}@${neon_project.default.host}/${neon_project_database.default_db.name}?sslmode=require"
}