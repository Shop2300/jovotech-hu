// seed-feature-icons.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultFeatureIcons = [
  {
    key: 'doprava_zdarma',
    title: 'Free Shipping',
    titleCs: 'Doprava zdarma',
    description: 'Free shipping on orders over 1000 CZK',
    descriptionCs: 'Při objednávce nad 1000 Kč',
    emoji: '🚚',
    order: 1,
    isActive: true,
  },
  {
    key: 'rychle_doruceni',
    title: 'Fast Delivery',
    titleCs: 'Rychlé doručení',
    description: 'Delivery within 1-2 business days',
    descriptionCs: 'Doručení do 1-2 pracovních dnů',
    emoji: '⚡',
    order: 2,
    isActive: true,
  },
  {
    key: 'overene_recenze',
    title: 'Verified Reviews',
    titleCs: 'Ověřené recenze',
    description: 'Real customer reviews',
    descriptionCs: 'Skutečné recenze zákazníků',
    emoji: '⭐',
    order: 3,
    isActive: true,
  },
  {
    key: 'zaruka_kvality',
    title: 'Quality Guarantee',
    titleCs: 'Záruka kvality',
    description: '30-day money-back guarantee',
    descriptionCs: '30denní záruka vrácení peněz',
    emoji: '✅',
    order: 4,
    isActive: true,
  },
  {
    key: 'bezpecna_platba',
    title: 'Secure Payment',
    titleCs: 'Bezpečná platba',
    description: 'SSL encrypted payment',
    descriptionCs: 'Šifrovaná platba SSL',
    emoji: '🔒',
    order: 5,
    isActive: true,
  },
  {
    key: 'ceska_firma',
    title: 'Czech Company',
    titleCs: 'Česká firma',
    description: 'Local support and service',
    descriptionCs: 'Lokální podpora a servis',
    emoji: '🇨🇿',
    order: 6,
    isActive: true,
  },
  {
    key: 'podpora_24_7',
    title: '24/7 Support',
    titleCs: 'Podpora 24/7',
    description: 'We are here for you anytime',
    descriptionCs: 'Jsme tu pro vás kdykoliv',
    emoji: '💬',
    order: 7,
    isActive: true,
  },
  {
    key: 'vyhodne_ceny',
    title: 'Best Prices',
    titleCs: 'Výhodné ceny',
    description: 'Competitive prices guaranteed',
    descriptionCs: 'Garance nejlepších cen',
    emoji: '💰',
    order: 8,
    isActive: true,
  }
];

async function seedFeatureIcons() {
  try {
    console.log('🌱 Seeding feature icons...');

    for (const icon of defaultFeatureIcons) {
      // Check if icon already exists
      const existing = await prisma.featureIcon.findUnique({
        where: { key: icon.key }
      });

      if (existing) {
        console.log(`⏭️  Skipping ${icon.titleCs} - already exists`);
        continue;
      }

      // Create new icon
      await prisma.featureIcon.create({
        data: icon
      });

      console.log(`✅ Created: ${icon.titleCs}`);
    }

    console.log('\n🎉 Feature icons seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding feature icons:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFeatureIcons();