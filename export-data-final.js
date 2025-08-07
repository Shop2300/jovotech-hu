const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

console.log('Starting export process...');

// GalaxySklep-pl database URL
const SOURCE_DATABASE_URL = "postgresql://neondb_owner:npg_lXsZPM8oSpf6@ep-royal-dawn-a209rfrp-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasourceUrl: SOURCE_DATABASE_URL
});

async function exportData() {
  try {
    console.log('📦 Exporting from galaxysklep-pl database...\n');
    
    await prisma.$connect();
    
    const data = {
      categories: await prisma.category.findMany(),
      products: await prisma.product.findMany(),
      productVariants: await prisma.productVariant.findMany().catch(() => []),
      productImages: await prisma.productImage.findMany(),
      banners: await prisma.banner.findMany().catch(() => []),
      featureIcons: await prisma.featureIcon.findMany().catch(() => []),
      reviews: [] // Reviews don't exist in source
    };
    
    fs.writeFileSync('exported-data.json', JSON.stringify(data, null, 2));
    
    console.log('✅ Data exported successfully!\n');
    console.log('�� Exported:');
    console.log(`   - ${data.categories.length} categories`);
    console.log(`   - ${data.products.length} products`);
    console.log(`   - ${data.productImages.length} product images`);
    console.log(`   - ${data.featureIcons.length} feature icons`);
    
    // Check file size
    const stats = fs.statSync('exported-data.json');
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`\n📁 Export file size: ${fileSizeInMB.toFixed(2)} MB`);
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
