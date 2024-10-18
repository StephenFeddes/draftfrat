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

output "mongodb_connection_string" {
  value = mongodbatlas_advanced_cluster.default.connection_strings[0]
}