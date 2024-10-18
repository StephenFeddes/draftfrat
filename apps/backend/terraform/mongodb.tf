resource "mongodbatlas_project" "default" {
  name   = "draftfrat"
  org_id = "6607b01a46ad9572fc526289"
}

resource "mongodbatlas_cluster" "default" {
  project_id   = mongodbatlas_project.default.id
  name         = "draftfrat-cluster"
  provider_name = "AWS"
  provider_region_name = "US_EAST_1"
  provider_instance_size_name = "M0"
}

resource "mongodbatlas_project_ip_access_list" "ip" {
  project_id = mongodbatlas_project.default.id
  ip_address = "0.0.0.0/0"
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}

output "mongodb_connection_string" {
  value = mongodbatlas_cluster.default.srv_address
}