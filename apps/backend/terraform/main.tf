# Cloudflare Pages Project
resource "cloudflare_pages_project" "frontend_project" {
  account_id       = var.cloudflare_account_id
  name              = "rosterroyale-pages"
  production_branch = "main"

  build_config {
    build_command   = "npm install && npm run build"
    destination_dir = "dist"
    root_dir        = "apps/frontend/web"
  }
}

# Cloudflare DNS Record for Root Domain (rosterroyale.com)
resource "cloudflare_record" "default_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name     = "@" # Use "@" to represent the root domain (rosterroyale.com)
  value    = "${cloudflare_pages_project.frontend_project.name}.pages.dev" # Use the project's name to construct the URL
  type     = "CNAME"
  ttl      = 3600
  proxied  = false # You can set this to true if you want Cloudflare to manage caching and performance
}

# Cloudflare DNS Record for www Subdomain (www.rosterroyale.com)
resource "cloudflare_record" "www_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name     = "www" # This represents the www subdomain (www.rosterroyale.com)
  value    = "${cloudflare_pages_project.frontend_project.name}.pages.dev" # Use the project's name to construct the URL
  type     = "CNAME"
  ttl      = 3600
  proxied  = false # Same as above, set to true if desired
}