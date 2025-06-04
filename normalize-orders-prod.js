// normalize-orders-prod.js
const { PrismaClient } = require('@prisma/client');

// Use your production database URL here
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_lXsZPM8oSpf6@ep-royal-dawn-a209rfrp-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const prisma = new PrismaClient();

async function normalizeOrders() {
  try {
    console.log('Normalizing category orders...');
    
    // Get all categories grouped by parent
    const categories = await prisma.category.findMany({
      orderBy: [
        { parentId: 'asc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    
    // Group by parentId
    const grouped = {};
    categories.forEach(cat => {
      const key = cat.parentId || 'root';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(cat);
    });
    
    // Update orders for each group
    for (const [parentId, cats] of Object.entries(grouped)) {
      console.log(`\nUpdating orders for parent: ${parentId === 'root' ? 'Root categories' : parentId}`);
      
      for (let i = 0; i < cats.length; i++) {
        const newOrder = i * 10;
        if (cats[i].order !== newOrder) {
          await prisma.category.update({
            where: { id: cats[i].id },
            data: { order: newOrder }
          });
          console.log(`  - ${cats[i].name}: ${cats[i].order} → ${newOrder}`);
        } else {
          console.log(`  - ${cats[i].name}: ${newOrder} (no change)`);
        }
      }
    }
    
    console.log('\nDone! Category orders have been normalized.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

normalizeOrders();