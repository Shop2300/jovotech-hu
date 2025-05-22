const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding test products...');

  const products = [
    {
      name: 'Wireless Headphones',
      nameCs: 'Bezdrátová sluchátka',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 2499,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
    },
    {
      name: 'Smart Watch',
      nameCs: 'Chytré hodinky',
      description: 'Fitness tracker with heart rate monitor',
      price: 3999,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
    },
    {
      name: 'Coffee Maker',
      nameCs: 'Kávovar',
      description: 'Automatic espresso machine',
      price: 8999,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop'
    },
    {
      name: 'Backpack',
      nameCs: 'Batoh',
      description: 'Waterproof hiking backpack 30L',
      price: 1799,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
    console.log(`Added: ${product.nameCs}`);
  }

  console.log('All products added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
