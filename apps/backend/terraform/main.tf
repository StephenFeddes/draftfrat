resource "google_project_service" "cloud_resource_manager" {
  service = "cloudresourcemanager.googleapis.com"
}

resource "google_project_service" "container" {
  service = "container.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager]
  disable_on_destroy = false
}

resource "google_project_service" "compute" {
  service = "compute.googleapis.com"
  depends_on = [google_project_service.cloud_resource_manager]
  disable_on_destroy = false
}

# Ensure that the Kubernetes Engine API is enabled before creating the GKE cluster
resource "google_container_cluster" "default" {
  name     = var.cluster_name
  location = var.zone
  initial_node_count = 1
  deletion_protection = false

  node_config {
    machine_type = "g1-small"
    preemptible  = true
    disk_size_gb = 32
  }

  depends_on = [
    google_project_service.container,
    google_project_service.compute
  ]
}