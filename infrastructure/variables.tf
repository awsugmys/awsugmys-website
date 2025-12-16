variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Name of the S3 bucket for hosting the website"
  type        = string
  default     = "awsugmys-website"
}

variable "domain_name" {
  description = "Domain name for the website (optional)"
  type        = string
  default     = "awsugmys.in"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for the custom domain (optional)"
  type        = string
  default     = ""
}

variable "use_custom_domain" {
  description = "Whether to use a custom domain with SSL certificate"
  type        = bool
  default     = false
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "awsugmys-website"
}