resource "mongodbatlas_project" "default" {
  name   = "draftfrat"
  org_id = "65e4c9963d64375d8e02a9d7"
}

resource "mongodbatlas_advanced_cluster" "default" {
  project_id                 = mongodbatlas_project.default.id
  name                       = "draftfrat-cluster"
  cluster_type               = "REPLICASET"

  replication_specs {
    region_configs {
      electable_specs {
        instance_size = "M0" # Free tier cluster
      }
      provider_name = "TENANT"
      backing_provider_name = "AWS"
      region_name = "US_EAST_1"
      priority = 1
    }
  }

  lifecycle {
    ignore_changes = [replication_specs] # Ignore changes on replication specs to prevent unwanted updates
  }
}


resource "mongodbatlas_project_ip_access_list" "ip" {
  project_id = mongodbatlas_project.default.id
  cidr_block = "0.0.0.0/0"
}

resource "random_password" "db_password" {
  length  = 16
  special = false  # No special characters
  upper   = true   # Optionally, include uppercase letters
  lower   = true   # Optionally, include lowercase letters
  number  = true   # Optionally, include numbers
}

resource "mongodbatlas_database_user" "default" {
  username       = "dbUser"
  password       = random_password.db_password.result
  project_id     = mongodbatlas_project.default.id
  auth_database_name  = "admin"
  
  roles {
    role_name     = "readWriteAnyDatabase"
    database_name = "admin"
  }
}

output "mongodb_connection_string" {
  value = "mongodb+srv://${mongodbatlas_database_user.default.username}:${random_password.db_password.result}@${replace(mongodbatlas_advanced_cluster.default.connection_strings[0].standard_srv, "mongodb+srv://", "")}/?retryWrites=true&w=majority"
  sensitive = true
}
