# Contributing to AWS User Group Mysuru Website

Thank you for your interest in contributing to the AWS User Group Mysuru website! We welcome contributions from the community.

## 🤝 How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in [GitHub Issues](https://github.com/awsugmys/awsugmys-website/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable

### Contributing Code

1. **Fork the repository**
   ```bash
   git fork https://github.com/awsugmys/awsugmys-website.git
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/awsugmys-website.git
   cd awsugmys-website
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the existing code style
   - Test your changes locally
   - Update documentation if needed

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Provide a clear description of your changes

## 📝 Content Contributions

### Adding Blog Posts

1. Create a new file in `src/pages/blog/`
2. Use the format: `YYYY-MM-DD-your-post-title.md`
3. Include proper frontmatter:
   ```markdown
   ---
   templateKey: blog-post
   title: Your Post Title
   date: 2024-12-16T10:00:00.000Z
   description: Brief description
   featuredpost: false
   featuredimage: /img/your-image.jpg
   tags:
     - aws
     - community
   ---
   ```

### Updating Information

- **About Page**: Edit `src/pages/about/index.md`
- **Leadership**: Update the leadership section in the about page
- **Contact Info**: Update contact details as needed

## 🎨 Design Guidelines

### Branding

- Use official AWS User Group Mysuru logos
- Follow the color scheme defined in `src/components/all.sass`
- Maintain consistency with existing design

### Code Style

- Use Prettier for formatting
- Follow React best practices
- Write meaningful component and variable names
- Add comments for complex logic

### Images

- Optimize images before adding them
- Use appropriate formats (PNG for logos, JPG for photos)
- Place images in `static/img/` directory

## 🧪 Testing

Before submitting your contribution:

1. **Test locally**
   ```bash
   npm run develop
   ```

2. **Build successfully**
   ```bash
   npm run build
   ```

3. **Check for errors**
   - No console errors
   - All links work
   - Images load correctly
   - Responsive design works

## 📋 Pull Request Guidelines

### PR Title Format

Use one of these prefixes:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing content
- `Docs:` for documentation changes
- `Style:` for styling changes

### PR Description

Include:
- What changes you made
- Why you made them
- Any testing you performed
- Screenshots (if UI changes)

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your changes will be automatically deployed

## 🚀 Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Local Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run develop`
3. Open `http://localhost:8000`

### Infrastructure (Optional)

If working on infrastructure:
- Install Terraform
- Configure AWS CLI
- See `infrastructure/README.md`

## 🎯 Areas for Contribution

We especially welcome contributions in:

- **Content**: Blog posts, event updates, community news
- **Features**: New functionality, improvements
- **Design**: UI/UX improvements, accessibility
- **Documentation**: Guides, tutorials, API docs
- **Infrastructure**: Terraform improvements, CI/CD enhancements

## 📞 Getting Help

If you need help:

1. Check existing [documentation](README.md)
2. Look at [past issues](https://github.com/awsugmys/awsugmys-website/issues)
3. Ask in our [community channels](README.md#community-links)
4. Contact the maintainers: [info@awsugmys.in](mailto:info@awsugmys.in)

## 🏆 Recognition

Contributors will be:
- Listed in our contributors section
- Mentioned in release notes
- Recognized in our community channels

Thank you for helping make AWS User Group Mysuru's website better! 🙏