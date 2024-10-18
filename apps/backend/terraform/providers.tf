terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
    neon = {
      source = "kislerdm/neon"
      version = "0.6.3"
    }
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "~> 1.6.0"
    }
  }

  backend "gcs" {
    bucket = "draftfrat_terraform_bucket"
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

provider "mongodbatlas" {
  public_key  = var.mongodb_public_key
  private_key = var.mongodb_private_key
}

provider "neon" {
  api_key = var.neon_api_key
}
