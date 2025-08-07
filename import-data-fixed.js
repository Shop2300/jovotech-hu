const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('📥 Importing to jovotech-hu database...\n');
    
    const data = JSON.parse(fs.readFileSync('exported-data.json', 'utf8'));
    
    // Sort categories: parents first, then children
    console.log(`Sorting and importing ${data.categories.length} categories...`);
    const categoriesWithoutParent = data.categories.filter(c => !c.parentId);
    const categoriesWithParent = data.categories.filter(c => c.parentId);
    
    // Import parent categories first
    for (const category of categoriesWithoutParent) {
      await prisma.category.create({
        data: category
      });
    }
    console.log(`  ✓ Imported ${categoriesWithoutParent.length} parent categories`);
    
    // Import child categories
    for (const category of categoriesWithParent) {
      await prisma.category.create({
        data: category
      });
    }
    console.log(`  ✓ Imported ${categoriesWithParent.length} child categories`);
    
    // Import products in batches
    console.log(`\nImporting ${data.products.length} products...`);
    for (let i = 0; i < data.products.length; i++) {
      const product = data.products[i];
      try {
        await prisma.product.create({
          data: product
        });
      } catch (err) {
        console.log(`  Warning: Skipping product ${product.id} - ${err.message}`);
      }
      if ((i + 1) % 500 === 0) console.log(`  Processed ${i + 1} products...`);
    }
    console.log(`  ✓ Products import completed`);
    
    // Import product images in batches
    console.log(`\nImporting ${data.productImages.length} product images...`);
    for (let i = 0; i < data.productImages.length; i++) {
      const image = data.productImages[i];
      try {
        await prisma.productImage.create({
          data: image
        });
      } catch (err) {
        // Skip if image already exists or product doesn't exist
      }
      if ((i + 1) % 5000 === 0) console.log(`  Processed ${i + 1} images...`);
    }
    console.log(`  ✓ Images import completed`);
    
    // Import feature icons
    if (data.featureIcons && data.featureIcons.length > 0) {
      console.log(`\nImporting ${data.featureIcons.length} feature icons...`);
      for (const icon of data.featureIcons) {
        try {
          await prisma.featureIcon.create({
            data: icon
          });
        } catch (err) {
          // Skip if already exists
        }
      }
      console.log(`  ✓ Feature icons imported`);
    }
    
    // Verify import
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const imageCount = await prisma.productImage.count();
    
    console.log('\n✅ Import completed successfully!');
    console.log('\n📊 Database now contains:');
    console.log(`   - ${categoryCount} categories`);
    console.log(`   - ${productCount} products`);
    console.log(`   - ${imageCount} product images`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    console.error('Details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
