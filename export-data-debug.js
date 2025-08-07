const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

console.log('Starting export process...');

// GalaxySklep-pl database URL
const SOURCE_DATABASE_URL = "postgresql://neondb_owner:npg_lXsZPM8oSpf6@ep-royal-dawn-a209rfrp-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

console.log('Creating Prisma client...');
const prisma = new PrismaClient({
  datasourceUrl: SOURCE_DATABASE_URL,
  log: ['error', 'warn']
});

async function exportData() {
  try {
    console.log('📦 Connecting to galaxysklep-pl database...');
    
    // Test connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    
    console.log('Fetching categories...');
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories`);
    
    console.log('Fetching products...');
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products`);
    
    console.log('Fetching product variants...');
    const productVariants = await prisma.productVariant.findMany();
    console.log(`Found ${productVariants.length} variants`);
    
    console.log('Fetching product images...');
    const productImages = await prisma.productImage.findMany();
    console.log(`Found ${productImages.length} images`);
    
    console.log('Fetching banners...');
    const banners = await prisma.banner.findMany();
    console.log(`Found ${banners.length} banners`);
    
    console.log('Fetching feature icons...');
    const featureIcons = await prisma.featureIcon.findMany();
    console.log(`Found ${featureIcons.length} feature icons`);
    
    console.log('Fetching reviews...');
    const reviews = await prisma.review.findMany();
    console.log(`Found ${reviews.length} reviews`);
    
    const data = {
      categories,
      products,
      productVariants,
      productImages,
      banners,
      featureIcons,
      reviews
    };
    
    console.log('Writing to file...');
    fs.writeFileSync('exported-data.json', JSON.stringify(data, null, 2));
    
    console.log('✅ Data exported successfully to exported-data.json!');
    console.log(`📊 Summary: 
      - ${categories.length} categories
      - ${products.length} products
      - ${productVariants.length} product variants
      - ${productImages.length} product images
      - ${banners.length} banners
      - ${featureIcons.length} feature icons
      - ${reviews.length} reviews`);
  } catch (error) {
    console.error('❌ Export failed:', error);
    console.error('Full error details:', error.stack);
  } finally {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    console.log('Disconnected.');
  }
}

console.log('Running export function...');
exportData().then(() => {
  console.log('Export process completed.');
}).catch((err) => {
  console.error('Export process failed:', err);
  process.exit(1);
});
