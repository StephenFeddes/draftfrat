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

locals {
  # This will give you the absolute paths of all files in the dist directory
  files = [
    for file in fileset("${path.module}/../../frontend/web/dist", "**") : abspath(file)
  ]
}

resource "google_storage_bucket_object" "files" {
  for_each = toset(local.files)

  # This is the name of the object in GCS (relative to the bucket root)
  name   = replace(each.value, "${path.module}/../../frontend/web/dist/", "")

  # This is the path to the local file being uploaded
  source = each.value
  
  # The bucket to which the file is being uploaded
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