variable "gcp_project" {
  description = "The GCP project ID"
  default = "rosterroyale"
}

variable "zone" {
  description = "The GCP zone to deploy the cluster to"
  default = "us-central1-a"
}

variable "region" {
  description = "The GCP region to deploy the cluster to"
  default = "us-central1"
}

variable "cloudflare_api_key" {
  description = "The Cloudflare API token"
}

variable "cloudflare_account_id" {
  description = "The Cloudflare account ID"
}

variable cloudflare_email {
  description = "The Cloudflare email address"
}

variable cluster_name {
    description = "The name of the GKE cluster"
    default = "rosterroyale-cluster"
}

variable domain_name {
  description = "The domain name to use for the cluster"
  default = "rosterroyale.com"
}