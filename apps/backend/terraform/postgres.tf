# Create a Neon Project with valid history retention seconds
resource "neon_project" "default" {
  name                       = "DraftFratProject"
  history_retention_seconds  = 86400  # Maximum allowed value
}

# Create a Neon Database in the project
resource "neon_database" "users_db" {
  project_id = neon_project.default.id
  name       = "users"
  owner_name = "neondb_owner"  # Set to default owner
  branch_id  = neon_project.default.default_branch_id
}

# Output the connection string
output "postgres_connection_string" {
  value = "postgresql://${neon_project.default.database_user}:test@${neon_project.default.database_host}/"
}