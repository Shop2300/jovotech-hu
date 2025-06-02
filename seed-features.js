// seed-features.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const features = [
    {
      key: 'shipping_free',
      title: 'Free Shipping',
      titleCs: 'Doprava zdarma',
      description: 'On orders over 1000 CZK',
      descriptionCs: 'Při nákupu nad 1000 Kč',
      emoji: '🚚',
      order: 1,
      isActive: true
    },
    {
      key: 'zasilkovna',
      title: 'Zásilkovna',
      titleCs: 'Zásilkovna',
      description: '7000+ pickup points',
      descriptionCs: '7000+ výdejních míst',
      emoji: '📦',
      order: 2,
      isActive: true
    },
    {
      key: 'card_payment',
      title: 'Card Payment',
      titleCs: 'Platba kartou',
      description: 'Or cash on delivery',
      descriptionCs: 'Nebo na dobírku',
      emoji: '💳',
      order: 3,
      isActive: true
    },
    {
      key: 'returns',
      title: '14 Days Return',
      titleCs: '14 dní na vrácení',
      description: 'No questions asked',
      descriptionCs: 'Bez udání důvodu',
      emoji: '↩️',
      order: 4,
      isActive: true
    }
  ];

  console.log('Seeding feature icons...');

  for (const feature of features) {
    await prisma.featureIcon.upsert({
      where: { key: feature.key },
      update: feature,
      create: feature,
    });
    console.log(`✓ Created/Updated feature: ${feature.key}`);
  }

  console.log('Feature icons seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding features:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });