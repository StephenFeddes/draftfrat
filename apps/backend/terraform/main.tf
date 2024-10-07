# Create Google Cloud Storage Bucket
resource "google_storage_bucket" "draftfrat_frontend_bucket" {
  # Make sure to verify your domain with Google Search Console.
  # Make sure the IAM user whose credentials are used in the Google provider
  #  has the necessary permissions to verify the domain and
  # is listed as an owner in the Google Search Console.
  name     = "draftfrat.com"
  location = var.region
  website {
    main_page_suffix = "index.html"
  }

  # Make the bucket public
  uniform_bucket_level_access = true
  force_destroy = true
}

# Configure bucket access to be public
resource "google_storage_bucket_iam_member" "allUsers" {
  bucket = google_storage_bucket.draftfrat_frontend_bucket.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Cloudflare DNS record for your root domain
resource "cloudflare_record" "root_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "@"
  value   = "c.storage.googleapis.com"  # Use this for the root domain
  type    = "CNAME"
  proxied = true  # Enable Cloudflare's proxy
}

# Cloudflare DNS record for www subdomain
resource "cloudflare_record" "www_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "www"
  value   = "c.storage.googleapis.com"  # Use this for the www subdomain
  type    = "CNAME"
  proxied = true  # Enable Cloudflare's proxy
}