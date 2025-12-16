#!/bin/bash

# AWS User Group Mysuru Website - Terraform Infrastructure Deployment
# This script deploys the Terraform infrastructure for S3 hosting with CloudFront

set -e

# Configuration
BUCKET_NAME="awsugmys-website-$(date +%s)"  # Add timestamp for uniqueness
REGION="us-east-1"

echo "🚀 Deploying AWS infrastructure for AWS User Group Mysuru website using Terraform..."

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install Terraform first."
    echo "Visit: https://www.terraform.io/downloads.html"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Create terraform.tfvars if it doesn't exist
if [ ! -f terraform.tfvars ]; then
    echo "📝 Creating terraform.tfvars file..."
    cat > terraform.tfvars << EOF
aws_region   = "$REGION"
bucket_name  = "$BUCKET_NAME"
domain_name  = "awsugmys.in"
environment  = "production"
project_name = "awsugmys-website"
EOF
    echo "✅ Created terraform.tfvars with bucket name: $BUCKET_NAME"
fi

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

# Plan the deployment
echo "📋 Planning Terraform deployment..."
terraform plan

# Apply the deployment
echo "🚀 Applying Terraform configuration..."
terraform apply -auto-approve

# Get outputs
echo "📊 Getting Terraform outputs..."
WEBSITE_URL=$(terraform output -raw website_url)
CLOUDFRONT_URL=$(terraform output -raw cloudfront_url)
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
ACCESS_KEY_ID=$(terraform output -raw github_actions_access_key_id)
SECRET_ACCESS_KEY=$(terraform output -raw github_actions_secret_access_key)
BUCKET_NAME_OUTPUT=$(terraform output -raw website_bucket_name)

echo ""
echo "🎉 Infrastructure deployment complete!"
echo ""
echo "📊 Infrastructure Details:"
echo "S3 Bucket: $BUCKET_NAME_OUTPUT"
echo "Region: $REGION"
echo ""
echo "🌐 URLs:"
echo "S3 Website URL: http://$WEBSITE_URL"
echo "CloudFront URL: $CLOUDFRONT_URL"
echo ""
echo "🔧 GitHub Actions Configuration:"
echo "Add these secrets to your GitHub repository:"
echo ""
echo "AWS_ACCESS_KEY_ID: $ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY: $SECRET_ACCESS_KEY"
echo "AWS_REGION: $REGION"
echo "S3_BUCKET_NAME: $BUCKET_NAME_OUTPUT"
echo "CLOUDFRONT_DISTRIBUTION_ID: $DISTRIBUTION_ID"
echo ""
echo "⚠️  Important: Store the SECRET_ACCESS_KEY securely as it won't be shown again!"
echo ""
echo "🚀 Next steps:"
echo "1. Add the above secrets to your GitHub repository settings"
echo "2. Push your code to the main branch to trigger the deployment"
echo "3. Your website will be available at: $CLOUDFRONT_URL"
echo ""
echo "💡 To destroy the infrastructure later, run: terraform destroy"