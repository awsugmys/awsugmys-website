output "site_url" {
  description = "Public URL of the site."
  value       = "https://${var.domain_name}"
}

output "cloudfront_domain_name" {
  description = "CloudFront hostname (useful for testing before DNS propagates)."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "github_actions_variables" {
  description = "Add these as repository variables in GitHub: Settings > Secrets and variables > Actions > Variables."
  value = {
    AWS_REGION                 = var.aws_region
    AWS_DEPLOY_ROLE_ARN        = aws_iam_role.github_deploy.arn
    S3_BUCKET                  = aws_s3_bucket.site.bucket
    CLOUDFRONT_DISTRIBUTION_ID = aws_cloudfront_distribution.site.id
  }
}
