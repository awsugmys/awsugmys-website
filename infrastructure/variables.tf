variable "domain_name" {
  description = "Apex domain for the site. A public Route 53 hosted zone for it must already exist in this account."
  type        = string
  default     = "awsugmys.in"
}

variable "include_www" {
  description = "Also serve www.<domain> (redirected to the apex domain)."
  type        = bool
  default     = true
}

variable "aws_region" {
  description = "Region for the S3 bucket and IAM resources."
  type        = string
  default     = "ap-south-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket holding the built site. Leave empty to derive one from the domain and account ID."
  type        = string
  default     = ""
}

variable "price_class" {
  description = "CloudFront price class. PriceClass_200 includes edge locations in India; PriceClass_100 does not."
  type        = string
  default     = "PriceClass_200"
}

variable "github_repository" {
  description = "GitHub repository (owner/name) allowed to deploy."
  type        = string
  default     = "awsugmys/awsugmys-website"
}

variable "github_environment" {
  description = "GitHub Actions environment allowed to assume the deploy role."
  type        = string
  default     = "production"
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub Actions OIDC provider. Set to false if the account already has one for token.actions.githubusercontent.com."
  type        = bool
  default     = true
}

variable "force_destroy_bucket" {
  description = "Allow terraform destroy to delete the bucket even when it contains files."
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags applied to every resource."
  type        = map(string)
  default = {
    Project   = "awsugmys-website"
    ManagedBy = "terraform"
  }
}

variable "overwrite_existing_dns_records" {
  description = "Replace existing A/AAAA records for the domain (and www) in the hosted zone. Leave false to fail safely if they exist."
  type        = bool
  default     = false
}
