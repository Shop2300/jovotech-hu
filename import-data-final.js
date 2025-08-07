const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Jovotech-hu database (reads from .env)
const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('📥 Importing to jovotech-hu database...\n');
    
    const data = JSON.parse(fs.readFileSync('exported-data.json', 'utf8'));
    
    // Import categories
    console.log(`Importing ${data.categories.length} categories...`);
    for (let i = 0; i < data.categories.length; i++) {
      const category = data.categories[i];
      await prisma.category.upsert({
        where: { id: category.id },
        update: category,
        create: category
      });
      if ((i + 1) % 10 === 0) console.log(`  Processed ${i + 1} categories...`);
    }
    
    // Import products in batches
    console.log(`\nImporting ${data.products.length} products...`);
    for (let i = 0; i < data.products.length; i++) {
      const product = data.products[i];
      await prisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      });
      if ((i + 1) % 500 === 0) console.log(`  Processed ${i + 1} products...`);
    }
    
    // Import product images in batches
    console.log(`\nImporting ${data.productImages.length} product images...`);
    for (let i = 0; i < data.productImages.length; i++) {
      const image = data.productImages[i];
      await prisma.productImage.upsert({
        where: { id: image.id },
        update: image,
        create: image
      });
      if ((i + 1) % 5000 === 0) console.log(`  Processed ${i + 1} images...`);
    }
    
    // Import feature icons if any
    if (data.featureIcons && data.featureIcons.length > 0) {
      console.log(`\nImporting ${data.featureIcons.length} feature icons...`);
      for (const icon of data.featureIcons) {
        await prisma.featureIcon.upsert({
          where: { id: icon.id },
          update: icon,
          create: icon
        });
      }
    }
    
    console.log('\n✅ All data imported successfully to jovotech-hu!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
