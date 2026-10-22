# Infrastructure

Terraform for hosting [awsugmys.in](https://awsugmys.in) on AWS. Nothing here has been applied
yet; run it from a machine with credentials for the AWS account that owns the `awsugmys.in`
Route 53 hosted zone.

```
GitHub (merge to main) ──► GitHub Actions ──(OIDC role)──► S3 bucket (private)
                                                               │
visitors ──► awsugmys.in ──► CloudFront ──(origin access control)┘
             www.awsugmys.in ──301──► awsugmys.in
```

## What it creates

| File             | Resources                                                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `s3.tf`          | Private S3 bucket (all public access blocked, encrypted, versioned, old versions expire after 30 days); readable only by the distribution     |
| `cloudfront.tf`  | CloudFront distribution, origin access control, security headers (HSTS, nosniff, frame deny, referrer policy) and the viewer-request function |
| `dns.tf`         | ACM certificate in `us-east-1` (validated through Route 53) and A/AAAA alias records for `awsugmys.in` and `www.awsugmys.in`                   |
| `github-oidc.tf` | GitHub Actions OIDC provider and the deploy role (upload to the bucket, invalidate the distribution; nothing else)                             |
| `functions/`     | The CloudFront Function: `/about/` → `/about/index.html`, `/about` → 301 `/about/`, `www` → 301 apex                                           |

It **uses** the existing public hosted zone for `awsugmys.in`; it never creates or deletes the
zone. Expected cost: well under US$1 a month for a community site (CloudFront's free tier covers
the traffic; the hosted zone already exists).

The deploy role trusts only `repo:awsugmys/awsugmys-website:environment:production`, so pull
requests, forks and other branches can't get AWS credentials.

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.6 or later (1.10+ if you use
  the S3 backend) and the [AWS CLI](https://aws.amazon.com/cli/).
- AWS credentials for the target account with permission to manage S3, CloudFront, ACM, Route 53
  records and IAM (for example an administrator via `aws login` or `aws sso login`). Check you're
  in the right account:

  ```bash
  aws sts get-caller-identity
  ```

- The hosted zone must be the one the domain actually uses. Its NS records must match the name
  servers set at the domain registrar, otherwise certificate validation hangs:

  ```bash
  aws route53 list-hosted-zones-by-name --dns-name awsugmys.in
  dig +short NS awsugmys.in
  ```

## Deploy

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars   # optional: defaults already target awsugmys.in
terraform init
terraform plan        # review: 22 to add, 0 to change, 0 to destroy
terraform apply
```

The first apply takes 5–15 minutes, mostly waiting for the certificate and the distribution.

Common adjustments in `terraform.tfvars`:

| Situation                                                                                 | Setting                                 |
| ----------------------------------------------------------------------------------------- | --------------------------------------- |
| `apply` fails with `EntityAlreadyExists` for the OIDC provider (account already uses GitHub OIDC) | `create_github_oidc_provider = false`   |
| `apply` fails because `awsugmys.in` or `www` already has A/AAAA records (e.g. an old site) | `overwrite_existing_dns_records = true` |
| Choose your own bucket name                                                               | `bucket_name = "..."`                   |

Records other than A/AAAA (MX, TXT, etc.) are never touched.

## Connect GitHub Actions

1. Print the values for GitHub:

   ```bash
   terraform output github_actions_variables
   ```

2. In the GitHub repository, **Settings → Secrets and variables → Actions → Variables**, add
   **repository** variables `AWS_REGION`, `AWS_DEPLOY_ROLE_ARN`, `S3_BUCKET` and
   `CLOUDFRONT_DISTRIBUTION_ID` with those values. (They aren't secret; no access keys are needed.)
3. **Settings → Environments → New environment** `production`. Under deployment branches, allow
   only `main`. Optionally add required reviewers.
4. **Settings → Branches**: protect `main` (require a pull request, an approval and the `CI`
   checks; block direct pushes).
5. Delete any old `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` secrets.
6. Run the **Deploy** workflow (Actions → Deploy → Run workflow) or merge to `main`.

Until `AWS_DEPLOY_ROLE_ARN` is set, the Deploy workflow skips itself.

## Check it

```bash
curl -sI https://awsugmys.in/                      # 200
curl -sI https://awsugmys.in/about                 # 301 → /about/
curl -sI https://www.awsugmys.in/events/           # 301 → https://awsugmys.in/events/
curl -sI https://awsugmys.in/no-such-page/         # 404 (the site's 404 page)
```

Before DNS propagates, test with `terraform output cloudfront_domain_name` (the `www` redirect
needs the real domain).

## State

By default Terraform keeps its state in `terraform.tfstate` in this folder. It's git-ignored and
**is the only record of what was created**: keep it safe, and run future `plan`/`apply` from the
same machine. To share it between laptops, store it in S3 instead (see `backend.tf.example`).

## Changing or removing

- Edit the `.tf` files or `terraform.tfvars`, then `terraform plan` and `terraform apply`.
- `npm run check:cdn-routing` (from the repository root, after `npm run build`) tests the
  CloudFront Function against every page in `dist/`. Run it after changing `functions/`.
- To tear everything down: empty the bucket (or set `force_destroy_bucket = true` and apply),
  then `terraform destroy`. The hosted zone and its other records stay.
