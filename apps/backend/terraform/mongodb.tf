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
            instance_size = "M0"
        }
        provider_name = "TENANT"
        backing_provider_name = "AWS"
        region_name = "US_EAST_1"
        priority = 1
    }
  }
}

resource "mongodbatlas_project_ip_access_list" "ip" {
  project_id = mongodbatlas_project.default.id
  cidr_block = "0.0.0.0/0"
}

resource "random_password" "db_password" {
  length  = 16
  special = true
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
output "connection_string" {
  value = "mongodb+srv://${mongodbatlas_database_user.default.username}:${mongodbatlas_database_user.default.password}@${mongodbatlas_advanced_cluster.default.name}-<your-cluster-id>.mongodb.net/draftfrat?retryWrites=true&w=majority"
}

output "connection_string" {
  value = "mongodb+srv://${mongodbatlas_database_user.default.username}:${mongodbatlas_database_user.default.password}@${mongodbatlas_advanced_cluster.default.name}.${mongodbatlas_advanced_cluster.default.id}.mongodb.net/?retryWrites=true&w=majority"
}