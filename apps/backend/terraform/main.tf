# Create Google Cloud Storage Bucket
resource "google_storage_bucket" "rosterroyale_frontend_bucket" {
  name     = "rosterroyale_frontend_bucket"
  location = var.region
  website {
    main_page_suffix = "index.html"
  }

  # Make the bucket public
  uniform_bucket_level_access = true
}

# Dynamically fetch the list of files to upload
resource "google_storage_bucket_object" "static_files" {
  for_each = fileset("apps/frontend/web/dist", "**")

  name   = each.value
  source = "apps/frontend/web/dist/${each.value}"
  bucket = google_storage_bucket.rosterroyale_frontend_bucket.name
}

# Configure bucket access to be public
resource "google_storage_bucket_iam_member" "allUsers" {
  bucket = google_storage_bucket.rosterroyale_frontend_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Cloudflare DNS record for your root domain (e.g., rosterroyale.com)
resource "cloudflare_record" "root_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = var.domain_name
  value   = "rosterroyale_frontend_bucket.storage.googleapis.com"
  type    = "CNAME"
  proxied = false
}

# Cloudflare DNS record for www subdomain (e.g., www.rosterroyale.com)
resource "cloudflare_record" "www_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "www"
  value   = "rosterroyale_frontend_bucket.storage.googleapis.com"
  type    = "CNAME"
  proxied = false
}