#!/bin/bash

# AWS User Group Mysuru Website - Terraform Infrastructure Destruction
# This script destroys the Terraform infrastructure

set -e

echo "🗑️  Destroying AWS infrastructure for AWS User Group Mysuru website..."

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install Terraform first."
    exit 1
fi

# Check if terraform.tfstate exists
if [ ! -f terraform.tfstate ]; then
    echo "❌ No Terraform state file found. Nothing to destroy."
    exit 1
fi

# Show what will be destroyed
echo "📋 Planning destruction..."
terraform plan -destroy

# Confirm destruction
read -p "⚠️  Are you sure you want to destroy all infrastructure? This cannot be undone. (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Destruction cancelled."
    exit 1
fi

# Destroy infrastructure
echo "🗑️  Destroying infrastructure..."
terraform destroy -auto-approve

echo ""
echo "✅ Infrastructure destroyed successfully!"
echo ""
echo "🧹 Cleanup complete. All AWS resources have been removed."