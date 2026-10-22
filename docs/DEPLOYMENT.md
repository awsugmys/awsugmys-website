# Deployment

> Status: **ready, not deployed.** The Terraform in `infrastructure/` and the workflows in
> `.github/workflows/` are in the repository but nothing has been created in AWS yet. Follow
> [infrastructure/README.md](../infrastructure/README.md) to set it up.

## Amazon S3 + Amazon CloudFront, deployed by GitHub Actions

The site is a folder of static files (`dist/`), so it needs no servers at all.

```
GitHub (merge to main) ──► GitHub Actions ──(OIDC, no stored keys)──► S3 bucket (private)
                                                                          │
visitors ──► awsugmys.in ──► CloudFront (HTTPS, global CDN) ──(OAC)───────┘
                               └─ CloudFront Function: /about/ → /about/index.html
```

| Piece                   | Role                                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| Amazon S3 (private)     | Stores the built site. Not public; only CloudFront can read it.              |
| Amazon CloudFront       | Serves the site worldwide over HTTPS with caching and security headers.      |
| CloudFront Function     | Maps directory URLs to `index.html`, adds trailing slashes, redirects `www`. |
| AWS Certificate Manager | Free TLS certificate for `awsugmys.in` and `www` (in `us-east-1`).           |
| Amazon Route 53         | The existing `awsugmys.in` hosted zone; Terraform adds the alias records.    |
| GitHub Actions + OIDC   | Builds and uploads on every merge to `main`, with short-lived credentials.   |

**Why this fits "I don't want to manage anything":** no servers, operating systems, patching,
scaling or databases. Once set up, the only interaction is merging pull requests. It's also the
cheapest option: CloudFront's always-free tier (1 TB of transfer and 10 million requests a month)
comfortably covers a community site, and the bucket holds a few MB. Expect **well under US$1 a
month** on top of the existing hosted zone.

**Alternative: AWS Amplify Hosting** connects directly to the repository with even less setup,
but builds run inside Amplify rather than GitHub Actions, it costs a little more and gives less
control over caching. Given the requirement that changes flow through GitHub Actions, S3 +
CloudFront is the better fit.

## Workflows

| Workflow     | Runs on                                      | AWS access | Does                                                                                    |
| ------------ | -------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `ci.yml`     | Every pull request to `main`                 | None       | `npm run check`, build, CloudFront routing test, `terraform fmt` and `validate`         |
| `deploy.yml` | Push to `main`, daily 00:00 IST, manual runs | OIDC role  | Build, upload to S3 (fingerprinted assets cached a year, pages revalidated), invalidate |

The daily run moves finished events from _Upcoming_ to _Past_ (the split happens at build time).
`deploy.yml` skips itself until the `AWS_DEPLOY_ROLE_ARN` repository variable is set.

## Who can deploy

Only the repository owner and contributors with write access can put changes live:

1. **The deploy workflow runs only on `main`.** Pull requests never deploy.
2. **Branch protection on `main`**: require a pull request with at least one approval and passing
   `CI` checks; don't allow direct pushes. Anyone can open a PR, but only people with write access
   can merge it.
3. **GitHub environment `production`**, restricted to the `main` branch (optionally with required
   reviewers for an extra approval step).
4. **AWS trusts only that environment.** The deploy role accepts GitHub's OIDC token only for
   `repo:awsugmys/awsugmys-website:environment:production`. Forks, other branches and pull
   requests can't obtain AWS credentials, and there are no long-lived keys to leak.
5. Pull requests from forks run `CI` with read-only permissions and no AWS access. Keep GitHub's
   default "require approval for first-time contributors".

## Go-live checklist

1. On a machine with credentials for the AWS account that owns the `awsugmys.in` hosted zone:
   `terraform init && terraform plan && terraform apply` in `infrastructure/`.
2. In GitHub: add the four repository variables from `terraform output github_actions_variables`,
   create the `production` environment (deployment branch `main`), protect `main`, and delete any
   old `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` secrets.
3. Merge to `main` (or run **Deploy** manually) and check the Actions run.
4. Test `https://awsugmys.in/`, `/about`, `/events/`, a blog post, `https://www.awsugmys.in/` and a
   missing page (should show the 404 page). See
   [infrastructure/README.md](../infrastructure/README.md#check-it).
