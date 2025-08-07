const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// GalaxySklep-pl database URL
const SOURCE_DATABASE_URL = "postgresql://neondb_owner:npg_lXsZPM8oSpf6@ep-royal-dawn-a209rfrp-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasourceUrl: SOURCE_DATABASE_URL
});

async function exportData() {
  try {
    console.log('📦 Connecting to galaxysklep-pl database...');
    
    const data = {
      categories: await prisma.category.findMany(),
      products: await prisma.product.findMany(),
      productVariants: await prisma.productVariant.findMany(),
      productImages: await prisma.productImage.findMany(),
      banners: await prisma.banner.findMany(),
      featureIcons: await prisma.featureIcon.findMany(),
      reviews: await prisma.review.findMany()
    };
    
    fs.writeFileSync('exported-data.json', JSON.stringify(data, null, 2));
    
    console.log('✅ Data exported successfully to exported-data.json!');
    console.log(`📊 Exported: 
      - ${data.categories.length} categories
      - ${data.products.length} products
      - ${data.productVariants.length} product variants
      - ${data.productImages.length} product images
      - ${data.banners.length} banners
      - ${data.featureIcons.length} feature icons
      - ${data.reviews.length} reviews`);
  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}