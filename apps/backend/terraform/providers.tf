terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"  # Specify the version you want
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"  # Specify the version you want
    }
  }

  backend "gcs" {
    bucket = "rosterroyale_terraform_bucket"
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