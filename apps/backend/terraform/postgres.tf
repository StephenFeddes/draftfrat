# Random password generator for the database user
resource "random_password" "pg_password" {
  length  = 16
  special = true
  override_special = "_%@"
}

# Create a Neon Project
resource "neon_project" "default" {
  name = "DraftFratProject"
}

# Create a branch in the Neon project
resource "neon_branch" "main" {
  project_id = neon_project.default.id
  name       = "main"
}

# Create a Neon Role (database user) and assign the generated password
resource "neon_role" "db_user" {
  project_id = neon_project.default.id
  branch_id  = neon_branch.main.id
  name       = "draftfrat_user"
}

# Create a Neon Database in the project
resource "neon_database" "users_db" {
  project_id = neon_project.default.id
  branch_id  = neon_branch.main.id
  name       = "users"
  owner_name = neon_role.db_user.name
}

# Output the connection string
output "postgres_connection_string" {
  value = format("postgresql://%s:%s@%s/%s?sslmode=require", 
    neon_role.db_user.name, 
    neon_role.db_user.password,  # This will work once exposed by Neon API/Provider
    neon_branch.main.host,  # Replace with actual host from Neon API
    neon_database.users_db.name
  )
  sensitive = true
}