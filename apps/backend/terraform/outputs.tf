output "postgres_connection_string" {
  value = "postgresql://${neon_project_role.db_user.name}:${random_password.pg_password.result}@${neon_project.default.host}/${neon_project_database.default_db.name}?sslmode=require"
}