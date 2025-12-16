#!/bin/bash

# AWS User Group Mysuru Website - Setup Validation
# This script validates that all prerequisites are met for deployment

set -e

echo "🔍 Validating setup for AWS User Group Mysuru website deployment..."

# Check if Terraform is installed
echo "Checking Terraform installation..."
if command -v terraform &> /dev/null; then
    TERRAFORM_VERSION=$(terraform version -json | jq -r '.terraform_version')
    echo "✅ Terraform is installed (version: $TERRAFORM_VERSION)"
else
    echo "❌ Terraform is not installed"
    echo "   Install from: https://www.terraform.io/downloads.html"
    exit 1
fi

# Check if AWS CLI is installed
echo "Checking AWS CLI installation..."
if command -v aws &> /dev/null; then
    AWS_VERSION=$(aws --version 2>&1 | cut -d/ -f2 | cut -d' ' -f1)
    echo "✅ AWS CLI is installed (version: $AWS_VERSION)"
else
    echo "❌ AWS CLI is not installed"
    echo "   Install from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
echo "Checking AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_USER=$(aws sts get-caller-identity --query Arn --output text)
    echo "✅ AWS credentials are configured"
    echo "   Account: $AWS_ACCOUNT"
    echo "   User: $AWS_USER"
else
    echo "❌ AWS credentials are not configured"
    echo "   Run: aws configure"
    exit 1
fi

# Check if jq is installed (for JSON parsing)
echo "Checking jq installation..."
if command -v jq &> /dev/null; then
    echo "✅ jq is installed"
else
    echo "⚠️  jq is not installed (optional but recommended)"
    echo "   Install: brew install jq (macOS) or apt-get install jq (Ubuntu)"
fi

# Validate Terraform configuration
echo "Validating Terraform configuration..."
if terraform validate &> /dev/null; then
    echo "✅ Terraform configuration is valid"
else
    echo "❌ Terraform configuration has errors"
    terraform validate
    exit 1
fi

# Check if terraform.tfvars exists
echo "Checking Terraform variables..."
if [ -f terraform.tfvars ]; then
    echo "✅ terraform.tfvars file exists"
else
    echo "⚠️  terraform.tfvars file not found"
    echo "   Copy terraform.tfvars.example to terraform.tfvars and customize"
fi

echo ""
echo "🎉 Setup validation complete!"
echo ""
echo "✅ All prerequisites are met. You can now run:"
echo "   ./deploy-infrastructure.sh"