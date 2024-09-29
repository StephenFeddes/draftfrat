# Create a GKE cluster with the cheapest configuration
resource "google_container_cluster" "default" {
  name     = var.cluster_name
  location = var.zone
  initial_node_count = 1

  node_config {
    machine_type = "g1-small"
    preemptible = true
    disk_size_gb = 32
  }
}

# Get the current authenticated Google account credentials
data "google_client_config" "default" {}

# Reserve a static IP address
resource "google_compute_address" "static_ip" {
  name   = "static_ip"
  region = var.region
}

resource "cloudflare_record" "my_record" {
  zone_id = var.zone
  name    = var.domain_name
  value   = google_compute_address.static_ip.address
  type    = "A"
  ttl     = 300
  proxied = true
}