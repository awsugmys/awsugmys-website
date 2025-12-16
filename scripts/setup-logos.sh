#!/bin/bash

# AWS User Group Mysuru - Logo Setup Script
# This script sets up the logos for different use cases

echo "🎨 Setting up AWS User Group Mysuru logos..."

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Copy the main logo (Black-Purple version for navbar and primary use)
cp "static/img/Black-Purple.png" "src/img/awsugmys-logo.png"
cp "static/img/Black-Purple.png" "static/img/awsugmys-logo.png"

# Keep the white version as an alternative
cp "static/img/White-Purple.png" "static/img/awsugmys-logo-light.png"

# Create cover image for about page and blog posts
cp "static/img/Black-Purple.png" "static/img/awsugmys-cover.jpg"

# Create a square version for social media (using the main logo)
cp "static/img/Black-Purple.png" "static/img/awsugmys-square.png"

# Update favicon files and social media image
cp "static/img/Black-Purple.png" "static/img/og-image.jpg"

echo "✅ Logo setup complete!"
echo ""
echo "📁 Available logo files:"
echo "   - src/img/awsugmys-logo.png (main Black-Purple logo for navbar)"
echo "   - static/img/awsugmys-logo.png (main Black-Purple logo)"
echo "   - static/img/awsugmys-logo-light.png (White-Purple alternative version)"
echo "   - static/img/awsugmys-cover.jpg (cover image)"
echo "   - static/img/awsugmys-square.png (square version)"
echo "   - static/img/og-image.jpg (social media sharing)"
echo ""
echo "💡 Consider creating proper favicon sizes (16x16, 32x32) using an image editor"