
resource "cloudflare_pages_project" "frontend_project" {
  account_id = var.cloudflare_account_id
  name = "rosterroyale-pages"
  production_branch = "main"

  build_config {
    build_command = "npm install && npm run build"
    destination_dir = "dist"
    root_dir = "apps/frontend/web"
  }
}

# Cloudflare DNS Record for Pages Custom Domain
resource "cloudflare_dns_record" "default_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = ""
  value   = var.domain_name
  type    = "CNAME"
  ttl     = 3600
  proxied = false
}

resource "cloudflare_dns_record" "www_domain" {
  zone_id = data.cloudflare_zones.default.zones[0].id
  name    = "www"
  value   = var.domain_name
  type    = "CNAME"
  ttl     = 3600
  proxied = false
}