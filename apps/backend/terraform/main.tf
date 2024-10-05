# Create Google Cloud Storage Bucket
resource "google_storage_bucket" "rosterroyale_bucket" {
  name     = "rosterroyale.com"  # Bucket name should match your domain
  location = var.region
  website {
    main_page_suffix = "index.html"  # Define your main page for static hosting
  }

  # Make the bucket public
  uniform_bucket_level_access = true
  force_destroy              = true
}

# Configure bucket access to be public
resource "google_storage_bucket_iam_member" "allUsers" {
  bucket = google_storage_bucket.rosterroyale_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"  # Make the bucket accessible to all users
}

# Cloudflare DNS record for your root domain
resource "cloudflare_record" "root_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "@"  # Using "@" for the root domain
  value   = "c.storage.googleapis.com"  # Use c.storage.googleapis.com
  type    = "CNAME"
  proxied = false
}

# Cloudflare DNS record for www subdomain
resource "cloudflare_record" "www_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "www"  # The www subdomain
  value   = "c.storage.googleapis.com"  # Use c.storage.googleapis.com
  type    = "CNAME"
  proxied = false
}