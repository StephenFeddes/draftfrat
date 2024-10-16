# Create a Neon Project with valid history retention seconds
resource "neon_project" "default" {
  name                       = "DraftFratProject"
  history_retention_seconds  = 86400  # Maximum allowed value
}

# Create a branch in the Neon project
resource "neon_branch" "production" {
  project_id = neon_project.default.id
  name       = "production"
}

# Create a Neon Role (database user) and assign the generated password
resource "neon_role" "db_user" {
  project_id = neon_project.default.id
  branch_id  = neon_branch.production.id
  name       = "draftfrat_user"
}

# Create a Neon Database in the project
resource "neon_database" "users_db" {
  project_id = neon_project.default.id
  branch_id  = neon_branch.production.id
  name       = "users"
  owner_name = neon_role.db_user.name
}

# Output the connection string
output "postgres_connection_string" {
  value     = neon_project.default.connection_uri
  sensitive = true
}