# AWS User Group Mysuru - Branding Guidelines

This document outlines the branding assets and guidelines for the AWS User Group Mysuru website.

## 🎨 Logo Assets

### Available Logo Variations

1. **Primary Logo** (`Black-Purple.png`)
   - Black background with purple AWS UG Mysuru text
   - Use for: Navbar, headers, primary branding
   - File: `src/img/awsugmys-logo.png`

2. **Light Background Logo** (`White-Purple.png`)
   - White background with purple AWS UG Mysuru text
   - Use for: Light themes, alternative presentations
   - File: `static/img/awsugmys-logo-light.png`

3. **Cover Image** (`awsugmys-cover.jpg`)
   - Used for about page and blog post featured images
   - File: `static/img/awsugmys-cover.jpg`

4. **Social Media** (`og-image.jpg`)
   - Used for Open Graph social media sharing
   - File: `static/img/og-image.jpg`

## 🔧 Logo Setup

Run the logo setup script to ensure all logos are properly configured:

```bash
./scripts/setup-logos.sh
```

## 📐 Usage Guidelines

### Navbar Logo
- Size: 100px width (responsive)
- Background: Transparent/white
- File: `src/img/awsugmys-logo.png`

### Cover Images
- Used in: About page, blog posts
- Aspect ratio: Flexible
- File: `static/img/awsugmys-cover.jpg`

### Social Media Sharing
- Used for: Facebook, Twitter, LinkedIn previews
- File: `static/img/og-image.jpg`

## 🎯 Brand Colors

Based on the AWS User Group Mysuru logo:

- **Primary Purple**: Used in logo text
- **AWS Orange**: #FF9900 (AWS brand color)
- **Background**: White (#FFFFFF)
- **Text**: Dark gray (#333333)

## 📱 Responsive Considerations

The logo automatically scales on different screen sizes:
- Desktop: 100px width
- Tablet: Scales proportionally
- Mobile: Scales proportionally

## 🔄 Updating Logos

To update or replace logos:

1. Add new logo files to `static/img/`
2. Update the `setup-logos.sh` script
3. Run the script to apply changes
4. Test on different screen sizes

## ✅ Quality Checklist

When adding new logo assets:

- [ ] High resolution (at least 300 DPI for print)
- [ ] Transparent background (PNG format)
- [ ] Multiple sizes available
- [ ] Optimized file size for web
- [ ] Consistent branding across variations

## 📞 Brand Assets Contact

For official AWS User Group Mysuru brand assets or questions:
- Email: info@awsugmys.in
- Ensure compliance with AWS trademark guidelines

---

*This branding guide ensures consistent visual identity across all AWS User Group Mysuru digital properties.*