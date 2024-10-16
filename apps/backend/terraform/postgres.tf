# Create a Neon Project with valid history retention seconds
resource "neon_project" "default" {
  name                       = "DraftFratProject"
  history_retention_seconds  = 86400  # Maximum allowed value
}

# Data source to fetch the existing default branch
data "neon_branch" "main" {
  project_id = neon_project.default.id
  name       = "main"  # Replace this with the actual name of the branch if it's different
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
  value     = neon_project.default.connection_uri
  sensitive = true
}