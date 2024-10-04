# Create Google Cloud Storage Bucket
resource "google_storage_bucket" "rosterroyale_frontend_bucket" {
  name     = "frontend_bucket"
  location = var.region
  website {
    main_page_suffix = "apps/frontend/web/dist/index.html"
  }

  # Make the bucket public
  uniform_bucket_level_access = true
}

# Configure bucket access to be public
resource "google_storage_bucket_iam_member" "allUsers" {
  bucket = google_storage_bucket.rosterroyale_frontend_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Cloudflare DNS record for your domain pointing to the Google Storage bucket via Cloudflare
resource "cloudflare_record" "root_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = var.domain_name
  value   = google_storage_bucket.rosterroyale_frontend_bucket.self_link
  type    = "CNAME"
  proxied = false
}

# Optional: Cloudflare DNS record for www subdomain (e.g., www.rosterroyale.com)
resource "cloudflare_record" "www_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "www"
  value   = google_storage_bucket.rosterroyale_frontend_bucket.self_link
  type    = "CNAME"
  proxied = false
}