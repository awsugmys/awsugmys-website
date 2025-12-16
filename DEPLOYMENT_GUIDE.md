# AWS User Group Mysuru Website - Deployment Guide

This guide walks you through deploying the AWS User Group Mysuru website with Terraform and GitHub Actions.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions  │───▶│   AWS S3 Bucket │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │   CloudFront    │
                                               │   Distribution  │
                                               └─────────────────┘
```

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Terraform** (>= 1.0) installed
4. **GitHub repository** with admin access
5. **Domain name** (optional, for custom domain)

## 🚀 Step-by-Step Deployment

### Step 1: Validate Setup

```bash
cd infrastructure
./validate-setup.sh
```

### Step 2: Deploy Infrastructure

```bash
./deploy-infrastructure.sh
```

This script will:
- Create a unique S3 bucket name
- Initialize and apply Terraform configuration
- Output GitHub Actions secrets

### Step 3: Configure GitHub Actions

1. Go to your GitHub repository
2. Navigate to `Settings > Secrets and variables > Actions`
3. Add the following secrets from the Terraform output:

```
AWS_ACCESS_KEY_ID: <from_terraform_output>
AWS_SECRET_ACCESS_KEY: <from_terraform_output>
AWS_REGION: us-east-1
S3_BUCKET_NAME: <from_terraform_output>
CLOUDFRONT_DISTRIBUTION_ID: <from_terraform_output>
```

### Step 4: Deploy Website

1. Push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Initial website deployment"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Install dependencies
   - Build the Gatsby site
   - Deploy to S3
   - Invalidate CloudFront cache

### Step 5: Verify Deployment

1. Check GitHub Actions workflow in the `Actions` tab
2. Visit your CloudFront URL (from Terraform output)
3. Verify the website loads correctly

## 🔧 Configuration Options

### Custom Domain Setup

The website is configured to support custom domains with SSL certificates. For awsugmys.in:

1. **Domain Configuration**: Already configured for `awsugmys.in`
2. **SSL Certificate**: Using ACM certificate `2084e1e8-2e42-4843-b6ae-ad550a234d94`
3. **Terraform Variables**: Update `terraform.tfvars`:
   ```hcl
   use_custom_domain = true
   domain_name       = "awsugmys.in"
   certificate_arn   = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/2084e1e8-2e42-4843-b6ae-ad550a234d94"
   ```
4. **DNS Configuration**: Create ALIAS record pointing to CloudFront distribution

**Current Status**: ✅ Custom domain `awsugmys.in` is active and working

### Environment-Specific Deployments

For multiple environments (staging, production):

1. **Create separate Terraform workspaces**:
   ```bash
   terraform workspace new staging
   terraform workspace new production
   ```

2. **Use environment-specific variable files**:
   ```bash
   terraform apply -var-file="staging.tfvars"
   ```

## 🛠️ Maintenance

### Update Infrastructure

```bash
cd infrastructure
terraform plan
terraform apply
```

### Update Website Content

1. Edit markdown files in `src/pages/`
2. Commit and push changes
3. GitHub Actions will automatically deploy

### Monitor Costs

- Check AWS Cost Explorer regularly
- Set up billing alerts
- Monitor CloudFront usage

### Backup Strategy

- Terraform state is stored locally (consider remote state)
- Website content is in Git (already backed up)
- S3 versioning is enabled for file recovery

## 🔍 Troubleshooting

### Common Issues

1. **Bucket name conflicts**:
   ```bash
   # Edit terraform.tfvars with a unique bucket name
   bucket_name = "awsugmys-website-your-unique-suffix"
   ```

2. **GitHub Actions failures**:
   - Check secrets are correctly set
   - Verify IAM permissions
   - Check build logs in Actions tab

3. **CloudFront caching issues**:
   ```bash
   # Invalidate cache manually
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

### Useful Commands

```bash
# Check Terraform state
terraform show

# View specific outputs
terraform output cloudfront_url

# Destroy infrastructure (careful!)
./destroy-infrastructure.sh
```

## 📊 Monitoring and Analytics

### CloudWatch Metrics

Monitor these key metrics:
- S3 bucket requests and data transfer
- CloudFront cache hit ratio
- Origin response times

### Google Analytics

Add Google Analytics to track website usage:

1. Create GA4 property
2. Add tracking code to `src/components/Layout.js`
3. Monitor visitor statistics

## 🔒 Security Best Practices

1. **IAM Least Privilege**: GitHub Actions user has minimal permissions
2. **HTTPS Only**: CloudFront redirects HTTP to HTTPS
3. **Regular Updates**: Keep dependencies updated
4. **Access Logging**: Enable S3 and CloudFront access logs
5. **Secrets Management**: Never commit secrets to Git

## 📈 Performance Optimization

1. **Image Optimization**: Use Gatsby's image processing
2. **Caching Strategy**: Configure appropriate TTL values
3. **Compression**: Enable Gzip compression in CloudFront
4. **CDN**: Leverage CloudFront's global edge locations

## 🆘 Support

For help with deployment:

1. Check the [infrastructure README](infrastructure/README.md)
2. Review AWS documentation
3. Contact AWS User Group Mysuru team: info@awsugmys.in

## 📝 Next Steps

After successful deployment:

1. **Content Management**: Set up Netlify CMS at `/admin`
2. **SEO Optimization**: Add meta tags and sitemap
3. **Social Media**: Update social media links
4. **Community**: Start planning your first meetup!
5. **Analytics**: Set up Google Analytics for visitor tracking

---

**Happy Deploying! 🚀**

*AWS User Group Mysuru Team*