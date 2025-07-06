#!/bin/bash

echo "Cleaning up Galaxy Sklep..."
echo ""

# Delete all the useless crap
echo "Deleting build cache..."
rm -rf .next

echo "Deleting Mac system files..."
find . -name ".DS_Store" -type f -delete

echo "Deleting source map files..."
find . -name "*.map" -type f -delete

echo "Deleting log files..."
rm -f *.log
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*

echo "Deleting Next.js cache folders..."
rm -rf .next/cache
rm -rf .next/server/app-paths-manifest.json
rm -rf .next/server/pages-manifest.json
rm -rf .next/build
rm -rf .next/trace
rm -rf .turbo
rm -rf .swc

echo "Deleting TypeScript build info..."
find . -name "*.tsbuildinfo" -type f -delete

echo "Deleting temporary files..."
find . -name "*~" -type f -delete
find . -name "*.tmp" -type f -delete

echo ""
echo "✓ Cleanup done. All junk deleted."
echo ""
echo "Run 'npm run build' when you need to rebuild the site."