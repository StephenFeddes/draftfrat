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
  name               = var.cluster_name
  location           = var.zone
  initial_node_count = 1
  deletion_protection = false

  node_config {
    machine_type = "custom-1-6656"  # 1 vCPU and 6.5 GB RAM (6656 MB)
    preemptible  = true
    disk_size_gb = 32
  }

  depends_on = [
    google_project_service.container,
    google_project_service.compute
  ]
}

# Get the current authenticated Google account credentials
data "google_client_config" "default" {}

# Reserve a static IP address
resource "google_compute_address" "static_ip" {
  name   = "static-ip"
  region = var.region
}

resource "cloudflare_record" "api_subdomain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "api"  # This creates the subdomain api.rosterroyale.com
  value   = google_compute_address.static_ip.address
  type    = "A"
  ttl     = 1
  proxied = true
}