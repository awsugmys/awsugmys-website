# AWS User Group Mysuru Website

Official Website of AWS User Group Mysuru:
<img width="3000" height="3000" alt="AWS-White" src="https://github.com/user-attachments/assets/f3b2882f-7848-4e68-8708-ecda70dce059" />

## 🌟 About

This is the official website for AWS User Group Mysuru, a community of passionate AWS developers, solution architects, DevOps engineers, and cloud enthusiasts in Mysuru, Karnataka, India.

🌐 **Live Website**: [awsugmys.in](https://awsugmys.in)

---

## 🌿 Branches

| Branch | Purpose |
|---|---|
| `main` | Original stable website |
| `website-2.0` | ✨ Redesigned UI — AWS-branded, professional, responsive |

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/awsugmys/awsugmys-website.git
   cd awsugmys-website
   ```

2. **Switch to the new design branch** *(for website-2.0)*
   ```bash
   git checkout website-2.0
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the dev server**
   ```bash
   npm run develop
   ```

5. **Open your browser**

   Your site is running at `http://localhost:8000`

### Troubleshooting: Port already in use

If port 8000 is already occupied:
```bash
# Kill whatever is using port 8000, then restart
kill -9 $(lsof -ti:8000) 2>/dev/null; npm run develop
```

### Clean build (if you see stale/broken pages)

```bash
npx gatsby clean && npm run develop
```

---

## 🏗️ Architecture

This website is built with:

- **Gatsby** — Static site generator for React
- **React** — UI component library
- **Bulma + Sass** — CSS framework & custom design system
- **GitHub Actions** — CI/CD pipeline
- **AWS S3** — Static website hosting
- **AWS CloudFront** — Global CDN
- **Terraform** — Infrastructure as Code

---

## 🎨 Design System (website-2.0)

The `website-2.0` branch introduces a full AWS-branded design system defined in `src/components/all.sass`:

| Token | Value | Usage |
|---|---|---|
| `$aws-navy` | `#232F3E` | Primary background, headings |
| `$aws-orange` | `#FF9900` | Accents, CTAs, highlights |
| `$aws-blue` | `#007EB9` | Links, secondary accents |
| `$aws-light` | `#F7F8F8` | Section backgrounds |

### Key components added

- **`src/components/Icons.js`** — Inline SVG icon library
- **`static/img/mysuru-palace.png`** — Mysuru Palace sketch used as hero watermark
- Reusable classes: `.hero-btn-primary`, `.hero-btn-secondary`, `.page-banner`, `.pillar-card`, `.event-card`, `.tag-pill`, `.stats-strip`, `.aws-footer`

---

## 📁 Project Structure

```
awsugmys-website/
├── src/
│   ├── components/
│   │   ├── all.sass          # Full design system & styles
│   │   ├── Navbar.js         # Sticky navbar with mobile menu
│   │   ├── Layout.js         # Global layout + footer
│   │   ├── ContactForm.js    # Event notification form
│   │   └── Icons.js          # SVG icon library (website-2.0)
│   ├── pages/
│   │   ├── index.js          # Homepage (hero, stats, pillars, posts)
│   │   ├── 404.js            # Branded 404 page
│   │   ├── about/index.md    # About page content & frontmatter
│   │   └── tags/index.js     # Topics directory
│   ├── templates/
│   │   ├── about-page.js     # About page template
│   │   ├── blog-post.js      # Blog post template
│   │   └── tags.js           # Tag filter template
│   └── img/                  # Source images
├── static/
│   └── img/                  # Static assets (logos, palace image)
├── logos/                    # Brand logos
├── infrastructure/           # Terraform configuration
├── .github/
│   └── workflows/            # GitHub Actions CI/CD
├── scripts/                  # Utility scripts
└── docs/                     # Documentation
```

---

## 📝 Content Management

### Adding Blog Posts

Create new posts in `src/pages/blog/` using this format:

```markdown
---
templateKey: blog-post
title: Your Post Title
date: 2024-12-16T10:00:00.000Z
description: Brief description of your post
featuredpost: false
tags:
  - aws
  - community
  - mysuru
---

Your blog content here...
```

### Updating the About Page

Edit `src/pages/about/index.md` to update team members, social links, and contact details. The frontmatter supports:

```yaml
---
connect:
  - label: Meetup
    icon: meetup
    url: https://meetup.com/awsugmys/
team:
  - name: Your Name
    role: Co-Organiser
    url: https://linkedin.com/in/yourprofile
contactEmail: info@awsugmys.in
speakerFormUrl: https://forms.gle/...
---
```

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run develop` | Start dev server at `http://localhost:8000` |
| `npm run build` | Build production static site to `/public` |
| `npm run serve` | Serve the built `/public` folder at `http://localhost:9000` |
| `npx gatsby clean` | Clear `.cache` and `public` folders |

---

## 🚀 Deployment

### Infrastructure Setup

AWS infrastructure is managed with Terraform:

```bash
cd infrastructure
./deploy-infrastructure.sh
```

**GitHub Secrets required:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`

### Automatic Deployment

Pushes to `main` automatically:
1. GitHub Actions builds the site with `npm run build`
2. Deploys static files to S3
3. Invalidates CloudFront cache
4. Site goes live at [awsugmys.in](https://awsugmys.in)

> **Note:** The `website-2.0` branch does not auto-deploy. Merge to `main` when ready for production.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test locally with `npm run develop`
4. Commit: `git commit -m "feat: describe your change"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request against `website-2.0` (or `main` for hotfixes)

---

## 👥 Leadership Team

- **Yeshwanth L M** — Lead ([LinkedIn](https://www.linkedin.com/in/yeshwanth-l-m/))
- **Girish A R** — Co-Organiser ([LinkedIn](https://www.linkedin.com/in/girish-a-r-a16aa3159/))
- **Aniruddh Koundinya** — Co-Organiser ([LinkedIn](https://www.linkedin.com/in/aniruddhkoundinya/))

## 📞 Contact

- **Email**: [info@awsugmys.in](mailto:info@awsugmys.in)
- **Speaker Form**: [Submit a talk proposal](https://forms.gle/uMkLMM4uJtVZ4iY3A)

## 🔗 Community Links

- [Meetup Group](https://www.meetup.com/awsugmys/)
- [LinkedIn](https://www.linkedin.com/company/awsugmys)
- [Twitter / X](https://www.twitter.com/awsugmys)
- [Facebook](https://www.facebook.com/awsugmys/)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**Built with ❤️ by AWS User Group Mysuru**
