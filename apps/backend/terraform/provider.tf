terraform {
  backend "gcs" {
    bucket = var.terraform_bucket
  }
}

provider "google" {
  project = var.gcp_project
  region  = var.region
}

provider "cloudflare" {
  email   = var.cloudflare_email
  api_key = var.cloudflare_api_key
}