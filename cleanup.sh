#!/bin/bash

# Galaxy Sklep Project Cleanup Script
# This script removes unnecessary files from the project

echo "🧹 Starting Galaxy Sklep project cleanup..."
echo "⚠️  This will delete many files. Make sure you have a backup!"
echo ""
read -p "Do you want to continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cleanup cancelled."
    exit 1
fi

# Create a backup first
echo "📦 Creating backup of current state..."
tar -czf galaxy-backup-$(date +%Y%m%d-%H%M%S).tar.gz --exclude='.next' --exclude='node_modules' .
echo "✅ Backup created"
echo ""

# 1. Remove all migration/utility scripts from root
echo "🗑️  Removing migration and utility scripts..."
rm -f add-addresses.js
rm -f add-products.js
rm -f add-tracking-number.js
rm -f check-categories.js
rm -f check-image-paths.js
rm -f check-invoice.js
rm -f check-orders.js
rm -f check-product-codes.js
rm -f check-product-feed.js
rm -f check-product-slugs.js
rm -f check-products.js
rm -f copy-ids-to-codes.js
rm -f final-cleanup-namecs.js
rm -f finalize-category-migration.js
rm -f find-namecs.js
rm -f fix-all-orders.js
rm -f fix-all-slugs.js
rm -f fix-order-now.js
rm -f fix-product-namecs.js
rm -f fix-remaining-namecs.js
rm -f fix-slugs.js
rm -f migrate-categories-to-czech-only.js
rm -f migrate-product-images.js
rm -f migrate-product-names-v2.js
rm -f normalize-orders-prod.js
rm -f quick-check.js
rm -f run-migration.js
rm -f seed-admin.js
rm -f seed-categories.js
rm -f seed-feature-icons.js
rm -f seed-features.js
rm -f setup.js
rm -f sync-product-names.js
rm -f test-order.js
rm -f test-redirect.js
rm -f test-setup.js
rm -f update-background.js
rm -f update-polish-product-slugs.js
rm -f update-product-slugs.js
rm -f verify-namecs.js
rm -f verify-seo-setup.js
rm -f fix-auth-imports.sh
echo "✅ Removed migration scripts"

# 2. Remove backup directory and files
echo ""
echo "🗑️  Removing backup files..."
rm -rf backup-before-bg-change/

# Remove all .bak files throughout the project
find . -name "*.bak" -type f -delete
find . -name "*.bak-*" -type f -delete

# Remove database backups
rm -f prisma/dev.db.backup-*
rm -f prisma/schema.prisma.backup
rm -f prisma/schema.prisma.auto-pulled

# Remove CSS backup
rm -f src/app/globals.css.backup

# Remove the old orders API backup
rm -rf src/app/api/admin/orders/\[id\].backup/

echo "✅ Removed backup files"

# 3. Clean up public directory
echo ""
echo "🗑️  Cleaning public directory..."

# Remove unnecessary SVG files
rm -f public/next.svg
rm -f public/vercel.svg
rm -f public/file.svg
rm -f public/globe.svg
rm -f public/window.svg

# Remove old invoice PDFs (keep the directory and .gitignore)
find public/invoices -name "*.pdf" -type f -delete

echo "✅ Cleaned public directory"

# 4. Remove misplaced files
echo ""
echo "🗑️  Removing misplaced files..."
rm -f src/app/admin/categories/finalize-category-migration.js

echo "✅ Removed misplaced files"

# 5. Clean up local uploads (optional - only if using Vercel Blob Storage)
echo ""
read -p "Do you want to remove local upload files? (Only do this if using Vercel Blob Storage) (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  Removing local uploads..."
    find public/uploads/products -name "*.jpg" -type f -delete
    find public/uploads/products -name "*.png" -type f -delete
    find public/uploads/products -name "*.webp" -type f -delete
    find public/uploads/products -name "*.jpeg" -type f -delete
    find public/uploads/banners -name "*.jpg" -type f -delete
    find public/uploads/banners -name "*.png" -type f -delete
    find public/uploads/banners -name "*.webp" -type f -delete
    find public/uploads/banners -name "*.jpeg" -type f -delete
    echo "✅ Removed local uploads"
fi

# 6. Clean .next directory (build cache)
echo ""
read -p "Do you want to clean the .next build directory? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  Cleaning build directory..."
    rm -rf .next/
    echo "✅ Cleaned build directory"
fi

# 7. Summary
echo ""
echo "📊 Cleanup Summary:"
echo "==================="
echo "✅ Removed all migration/utility scripts"
echo "✅ Removed all backup files and directories"
echo "✅ Cleaned public directory"
echo "✅ Removed misplaced files"
echo ""
echo "🎉 Project cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run 'npm install' to ensure dependencies are correct"
echo "2. Run 'npm run dev' to test the application"
echo "3. Commit these changes: git add -A && git commit -m 'chore: cleanup unnecessary files'"
echo "4. Push to repository: git push"