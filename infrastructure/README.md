# AWS User Group Mysuru Website Infrastructure

This directory contains Terraform configuration files to deploy the AWS infrastructure for the AWS User Group Mysuru website.

## Architecture

The infrastructure includes:

- **S3 Bucket**: Static website hosting with public read access
- **CloudFront Distribution**: CDN for global content delivery with HTTPS
- **IAM User**: Dedicated user for GitHub Actions deployments
- **IAM Policies**: Least-privilege access for S3 and CloudFront operations

## Prerequisites

1. **AWS CLI**: Install and configure with appropriate credentials
   ```bash
   aws configure
   ```

2. **Terraform**: Install Terraform (>= 1.0)
   ```bash
   # macOS
   brew install terraform
   
   # Or download from https://www.terraform.io/downloads.html
   ```

3. **AWS Permissions**: Your AWS user needs permissions to create:
   - S3 buckets and policies
   - CloudFront distributions
   - IAM users, policies, and access keys

## Quick Start

1. **Clone and navigate to infrastructure directory**:
   ```bash
   cd infrastructure
   ```

2. **Deploy infrastructure**:
   ```bash
   ./deploy-infrastructure.sh
   ```

3. **Configure GitHub Actions**: Add the output secrets to your GitHub repository

## Manual Deployment

If you prefer manual control:

1. **Copy and customize variables**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

2. **Initialize Terraform**:
   ```bash
   terraform init
   ```

3. **Plan deployment**:
   ```bash
   terraform plan
   ```

4. **Apply configuration**:
   ```bash
   terraform apply
   ```

## Configuration

### Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `aws_region` | AWS region for resources | `us-east-1` |
| `bucket_name` | S3 bucket name (must be globally unique) | `awsugmys-website` |
| `domain_name` | Domain name for the website | `awsugmys.in` |
| `environment` | Environment name | `production` |
| `project_name` | Project name | `awsugmys-website` |

### Outputs

After deployment, you'll get:

- S3 bucket name and ARN
- Website URL (S3 and CloudFront)
- CloudFront distribution ID
- GitHub Actions credentials

## GitHub Actions Setup

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

```
AWS_ACCESS_KEY_ID: <from terraform output>
AWS_SECRET_ACCESS_KEY: <from terraform output>
AWS_REGION: us-east-1
S3_BUCKET_NAME: <from terraform output>
CLOUDFRONT_DISTRIBUTION_ID: <from terraform output>
```

## Security Features

- **Least Privilege**: IAM user has minimal required permissions
- **HTTPS Redirect**: CloudFront redirects HTTP to HTTPS
- **Origin Access Control**: CloudFront uses OAC for secure S3 access
- **Encryption**: S3 bucket uses server-side encryption

## Cost Optimization

- **CloudFront Price Class**: Uses PriceClass_100 (US, Canada, Europe)
- **S3 Storage Class**: Standard (can be optimized based on usage)
- **Caching**: CloudFront caches content to reduce S3 requests

## Monitoring and Maintenance

### View Resources
```bash
terraform show
```

### Update Infrastructure
```bash
terraform plan
terraform apply
```

### Destroy Infrastructure
```bash
./destroy-infrastructure.sh
# or
terraform destroy
```

## Troubleshooting

### Common Issues

1. **Bucket name already exists**: S3 bucket names must be globally unique
   - Solution: Change `bucket_name` in `terraform.tfvars`

2. **AWS credentials not configured**:
   - Solution: Run `aws configure` or set environment variables

3. **Terraform state conflicts**:
   - Solution: Use Terraform remote state or coordinate with team

### Useful Commands

```bash
# Check AWS credentials
aws sts get-caller-identity

# Validate Terraform configuration
terraform validate

# Format Terraform files
terraform fmt

# Show current state
terraform state list
```

## File Structure

```
infrastructure/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Variable definitions
├── outputs.tf                 # Output definitions
├── terraform.tfvars.example   # Example variables file
├── deploy-infrastructure.sh   # Deployment script
├── destroy-infrastructure.sh  # Destruction script
└── README.md                  # This file
```

## Support

For issues or questions:
- Check the [Terraform AWS Provider documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- Contact the AWS User Group Mysuru team at info@awsugmys.in