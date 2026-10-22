data "aws_caller_identity" "current" {}

# The public hosted zone for the domain must already exist in this account.
data "aws_route53_zone" "site" {
  name         = var.domain_name
  private_zone = false
}

locals {
  www_domain  = "www.${var.domain_name}"
  aliases     = var.include_www ? [var.domain_name, local.www_domain] : [var.domain_name]
  name_prefix = replace(var.domain_name, ".", "-")
  bucket_name = (
    var.bucket_name != ""
    ? var.bucket_name
    : "${local.name_prefix}-site-${data.aws_caller_identity.current.account_id}"
  )
}
