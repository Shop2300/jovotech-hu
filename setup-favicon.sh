#!/bin/bash

# Galaxy Sklep Favicon Setup Script
# This script automatically sets up all favicon files for your website

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🎨 Galaxy Sklep Favicon Setup Script${NC}"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: This script must be run from the project root directory${NC}"
    echo "Please navigate to ~/Projects/czech-eshop and run again"
    exit 1
fi

# Check if source file exists
SOURCE_FILE="public/images/galaxysklep_favicon.png"
if [ ! -f "$SOURCE_FILE" ]; then
    echo -e "${RED}❌ Error: $SOURCE_FILE not found${NC}"
    echo "Please ensure the favicon file exists at this location"
    exit 1
fi

echo -e "${GREEN}✅ Found source favicon at $SOURCE_FILE${NC}"

# Create backup of existing favicons
echo -e "${YELLOW}📦 Creating backups...${NC}"
mkdir -p backups/favicon-backup-$(date +%Y%m%d-%H%M%S)
cp -r public/favicon* backups/favicon-backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true
cp -r public/apple-touch-icon* backups/favicon-backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true
cp src/app/favicon.ico backups/favicon-backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true
cp src/app/icon.png backups/favicon-backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo -e "${GREEN}✅ ImageMagick found. Generating all favicon sizes...${NC}"
    
    # Generate PNG favicons in different sizes
    echo "  📐 Generating favicon-16x16.png..."
    convert "$SOURCE_FILE" -resize 16x16 public/favicon-16x16.png
    
    echo "  📐 Generating favicon-32x32.png..."
    convert "$SOURCE_FILE" -resize 32x32 public/favicon-32x32.png
    
    echo "  📐 Generating favicon-192x192.png..."
    convert "$SOURCE_FILE" -resize 192x192 public/favicon-192x192.png
    
    echo "  📐 Generating favicon-512x512.png..."
    convert "$SOURCE_FILE" -resize 512x512 public/favicon-512x512.png
    
    echo "  📱 Generating apple-touch-icon.png (180x180)..."
    convert "$SOURCE_FILE" -resize 180x180 public/apple-touch-icon.png
    
    echo "  🔧 Generating favicon.ico with multiple sizes..."
    convert "$SOURCE_FILE" -define icon:auto-resize=64,48,32,16 public/favicon.ico
    
    # Copy ICO to app directory
    cp public/favicon.ico src/app/favicon.ico
    
    # Also create icon.png for Next.js 13+
    cp "$SOURCE_FILE" src/app/icon.png
    
    echo -e "${GREEN}✅ All favicon sizes generated successfully!${NC}"
else
    echo -e "${YELLOW}⚠️  ImageMagick not found. Using fallback method...${NC}"
    echo "   For optimal results, install ImageMagick:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu/Debian: sudo apt-get install imagemagick"
    echo ""
    
    # Fallback method - copy PNG files
    echo "  📋 Copying PNG as favicon..."
    cp "$SOURCE_FILE" src/app/icon.png
    cp "$SOURCE_FILE" public/favicon.png
    cp "$SOURCE_FILE" public/favicon-32x32.png
    cp "$SOURCE_FILE" public/favicon-192x192.png
    cp "$SOURCE_FILE" public/apple-touch-icon.png
fi

# Create manifest.json
echo -e "${YELLOW}📝 Creating manifest.json...${NC}"
cat > public/manifest.json << 'EOF'
{
  "name": "Galaxysklep.pl - Sklep internetowy",
  "short_name": "Galaxy Sklep",
  "description": "Najlepsze produkty w najlepszych cenach. Szeroki wybór elektroniki, akcesoriów i więcej.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6da306",
  "icons": [
    {
      "src": "/favicon-16x16.png",
      "sizes": "16x16",
      "type": "image/png"
    },
    {
      "src": "/favicon-32x32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/favicon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ],
  "lang": "pl",
  "dir": "ltr",
  "orientation": "portrait-primary",
  "categories": ["shopping", "lifestyle"]
}
EOF

# Create a sample layout.tsx update file
echo -e "${YELLOW}📝 Creating layout metadata template...${NC}"
cat > favicon-metadata-update.txt << 'EOF'
// Add this to your src/app/layout.tsx metadata export:

export const metadata: Metadata = {
  // ... existing metadata ...
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  // ... rest of metadata ...
}
EOF

# Summary
echo ""
echo -e "${GREEN}✅ Favicon setup complete!${NC}"
echo ""
echo "📁 Files created:"
echo "  • public/favicon.ico"
echo "  • public/favicon-16x16.png"
echo "  • public/favicon-32x32.png"
echo "  • public/favicon-192x192.png"
echo "  • public/favicon-512x512.png"
echo "  • public/apple-touch-icon.png"
echo "  • public/manifest.json"
echo "  • src/app/icon.png"
echo "  • src/app/favicon.ico"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Check favicon-metadata-update.txt for layout.tsx updates"
echo "2. Test locally: npm run dev"
echo "3. Clear browser cache (Cmd+Shift+R) to see changes"
echo "4. Commit and deploy:"
echo "   git add ."
echo "   git commit -m 'Update favicon with Galaxy Sklep logo'"
echo "   git push"
echo ""
echo -e "${GREEN}🎉 Done! Your new favicon is ready.${NC}"