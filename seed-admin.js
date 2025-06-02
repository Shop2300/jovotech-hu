// seed-admin.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for admin panel testing...');

  // Create sample products if none exist
  const productCount = await prisma.product.count();
  
  if (productCount === 0) {
    console.log('Creating sample products...');
    
    const products = [
      {
        name: 'Wireless Headphones',
        nameCs: 'Bezdrátová sluchátka',
        description: 'Kvalitní bezdrátová sluchátka s potlačením hluku',
        price: 2499,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
      },
      {
        name: 'Smart Watch',
        nameCs: 'Chytré hodinky',
        description: 'Fitness tracker s měřením tepu',
        price: 3999,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
      },
      {
        name: 'Coffee Maker',
        nameCs: 'Kávovar',
        description: 'Automatický espresso kávovar',
        price: 8999,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop'
      },
      {
        name: 'Backpack',
        nameCs: 'Batoh',
        description: 'Voděodolný turistický batoh 30L',
        price: 1799,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
      },
      {
        name: 'Desk Lamp',
        nameCs: 'Stolní lampa',
        description: 'LED stolní lampa s nastavitelným jasem',
        price: 899,
        stock: 0,
        image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=300&h=300&fit=crop'
      }
    ];

    for (const product of products) {
      await prisma.product.create({ data: product });
      console.log(`✅ Created product: ${product.nameCs}`);
    }
  }

  // Create sample orders if none exist
  const orderCount = await prisma.order.count();
  
  if (orderCount === 0) {
    console.log('Creating sample orders...');
    
    const orders = [
      {
        orderNumber: '202401-0001',
        customerEmail: 'jan.novak@example.com',
        customerName: 'Jan Novák',
        customerPhone: '+420 123 456 789',
        firstName: 'Jan',
        lastName: 'Novák',
        address: 'Václavské náměstí 1',
        city: 'Praha',
        postalCode: '11000',
        items: [
          { productId: 'sample1', quantity: 2, price: 2499 }
        ],
        total: 4998,
        status: 'completed',
        deliveryMethod: 'zasilkovna',
        paymentMethod: 'card'
      },
      {
        orderNumber: '202401-0002',
        customerEmail: 'marie.svobodova@example.com',
        customerName: 'Marie Svobodová',
        customerPhone: '+420 987 654 321',
        firstName: 'Marie',
        lastName: 'Svobodová',
        address: 'Karlova 15',
        city: 'Brno',
        postalCode: '60200',
        items: [
          { productId: 'sample2', quantity: 1, price: 3999 },
          { productId: 'sample3', quantity: 1, price: 1799 }
        ],
        total: 5798,
        status: 'processing',
        deliveryMethod: 'ppl',
        paymentMethod: 'bank'
      },
      {
        orderNumber: '202401-0003',
        customerEmail: 'petr.dvorak@example.com',
        customerName: 'Petr Dvořák',
        customerPhone: '+420 555 123 456',
        firstName: 'Petr',
        lastName: 'Dvořák',
        address: 'Masarykova 789',
        city: 'Ostrava',
        postalCode: '70200',
        items: [
          { productId: 'sample4', quantity: 3, price: 899 }
        ],
        total: 2697,
        status: 'pending',
        deliveryMethod: 'czechpost',
        paymentMethod: 'cod'
      }
    ];

    for (const order of orders) {
      await prisma.order.create({ data: order });
      console.log(`✅ Created order: ${order.orderNumber}`);
    }
  }

  console.log('✨ Database seeding completed!');
  console.log('\n📝 Admin Panel Credentials:');
  console.log('URL: http://localhost:3000/admin');
  console.log('Password: Check your ADMIN_PASSWORD in .env file');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });