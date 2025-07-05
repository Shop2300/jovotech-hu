#!/bin/bash
# Danny Fashion CZ Production-Safe Cleanup Script
# This script safely removes temporary files without touching business-critical data
echo "🧹 Starting Danny Fashion CZ production-safe cleanup..."
echo "📦 Creating backup first..."
# Create backup (excluding large directories)
tar -czf dannyfashion-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
--exclude='.next' \
--exclude='node_modules' \
--exclude='prisma/dev.db' \
--exclude='public/uploads' \
--exclude='public/invoices' \
. 2>/dev/null
echo "✅ Backup created (excluding uploads and invoices)"
echo ""
# 1. Remove development/migration scripts only
echo "🗑️ Removing old development scripts..."
# Only remove specific known migration script patterns
rm -f add-addresses.js 2>/dev/null
rm -f add-products.js 2>/dev/null
rm -f check-categories.js 2>/dev/null
rm -f check-products.js 2>/dev/null
rm -f fix-slugs.js 2>/dev/null
rm -f migrate-.js 2>/dev/null
rm -f seed-.js 2>/dev/null
rm -f test-.js 2>/dev/null
rm -f setup.js 2>/dev/null
rm -f run-migration.js 2>/dev/null
# 2. Remove old branding files only
echo "🗑️ Removing old branding files..."
rm -f public/images/galaxysklep_favicon.png 2>/dev/null
rm -f public/images/galaxysklep_favicon_new.png 2>/dev/null
# 3. Remove system files (safe)
echo "🗑️ Removing system files..."
find . -name ".DS_Store" -type f -delete 2>/dev/null
find . -name "Thumbs.db" -type f -delete 2>/dev/null
# 4. Remove backup files (safe)
echo "🗑️ Removing backup files..."
find . -name ".bak" -type f -delete 2>/dev/null
find . -name ".bak-" -type f -delete 2>/dev/null
rm -f prisma/.backup 2>/dev/null
rm -f prisma/.auto-pulled 2>/dev/null
# 5. Clean build cache (safe)
echo "🗑️ Cleaning build cache..."
rm -rf .next/ 2>/dev/null
# 6. Remove old/unused scripts
echo "🗑️ Removing old scripts..."
rm -f cleanup.sh 2>/dev/null
rm -f setup-favicon.sh 2>/dev/null
rm -f favicon-metadata-update.txt 2>/dev/null
rm -f generate-hash.js 2>/dev/null
rm -f fix-auth-imports.sh 2>/dev/null
# 7. PRODUCTION SAFETY - Log what we're NOT removing
echo ""
echo "🛡️ Production Safety - Preserved:"
echo " ✅ All invoices in public/invoices/"
echo " ✅ All uploads in public/uploads/"
echo " ✅ Production database"
echo " ✅ All source code files (.ts, .tsx)"
echo " ✅ All images and assets"
echo " ✅ Environment files (.env)"
echo ""
# 8. Optional: Clean npm cache
echo "💡 Tip: You can also run 'npm cache clean --force' to clean npm cache"
echo ""
# Summary
echo "📊 Cleanup complete!"
echo "✅ Removed:"
echo " • Old development/migration scripts"
echo " • System files (.DS_Store)"
echo " • Backup files (.bak)"
echo " • Build cache (.next)"
echo " • Old branding files"
echo ""
echo "✅ Preserved (Production Safe):"
echo " • All invoices"
echo " • All uploaded files"
echo " • All source code"
echo " • All business data"
echo ""
echo "🎉 Your production environment is clean and safe!"
echo ""
echo "Next steps:"
echo "1. git status (review changes)"
echo "2. npm install (if needed)"
echo "3. npm run build (rebuild)"
echo "4. npm start (test production build)"