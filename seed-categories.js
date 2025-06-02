// seed-categories.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Main categories
  const mainCategories = [
    {
      name: 'Electronics',
      nameCs: 'Elektronika',
      slug: 'elektronika',
      description: 'Electronic devices and accessories',
      descriptionCs: 'Elektronická zařízení a příslušenství',
      order: 1,
      isActive: true
    },
    {
      name: 'Clothing',
      nameCs: 'Oblečení',
      slug: 'obleceni',
      description: 'Fashion and apparel',
      descriptionCs: 'Móda a oděvy',
      order: 2,
      isActive: true
    },
    {
      name: 'Home & Garden',
      nameCs: 'Dům a zahrada',
      slug: 'dum-zahrada',
      description: 'Home improvement and garden supplies',
      descriptionCs: 'Vybavení pro dům a zahradu',
      order: 3,
      isActive: true
    },
    {
      name: 'Sports',
      nameCs: 'Sport',
      slug: 'sport',
      description: 'Sports equipment and activewear',
      descriptionCs: 'Sportovní vybavení a oblečení',
      order: 4,
      isActive: true
    },
  ];

  console.log('Seeding main categories...');

  const createdCategories = {};

  for (const category of mainCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    createdCategories[category.slug] = created;
    console.log(`✓ Created/Updated category: ${category.nameCs}`);
  }

  // Subcategories
  const subcategories = [
    // Electronics subcategories
    {
      name: 'Mobile Phones',
      nameCs: 'Mobilní telefony',
      slug: 'mobilni-telefony',
      description: 'Smartphones and accessories',
      descriptionCs: 'Chytré telefony a příslušenství',
      order: 1,
      isActive: true,
      parentId: createdCategories['elektronika'].id
    },
    {
      name: 'Computers',
      nameCs: 'Počítače',
      slug: 'pocitace',
      description: 'Desktops and laptops',
      descriptionCs: 'Stolní počítače a notebooky',
      order: 2,
      isActive: true,
      parentId: createdCategories['elektronika'].id
    },
    {
      name: 'Audio & Video',
      nameCs: 'Audio a video',
      slug: 'audio-video',
      description: 'Audio and video equipment',
      descriptionCs: 'Audio a video technika',
      order: 3,
      isActive: true,
      parentId: createdCategories['elektronika'].id
    },
    // Clothing subcategories
    {
      name: 'Men\'s Clothing',
      nameCs: 'Pánské oblečení',
      slug: 'panske-obleceni',
      description: 'Clothing for men',
      descriptionCs: 'Oblečení pro muže',
      order: 1,
      isActive: true,
      parentId: createdCategories['obleceni'].id
    },
    {
      name: 'Women\'s Clothing',
      nameCs: 'Dámské oblečení',
      slug: 'damske-obleceni',
      description: 'Clothing for women',
      descriptionCs: 'Oblečení pro ženy',
      order: 2,
      isActive: true,
      parentId: createdCategories['obleceni'].id
    },
    {
      name: 'Children\'s Clothing',
      nameCs: 'Dětské oblečení',
      slug: 'detske-obleceni',
      description: 'Clothing for children',
      descriptionCs: 'Oblečení pro děti',
      order: 3,
      isActive: true,
      parentId: createdCategories['obleceni'].id
    },
    // Home & Garden subcategories
    {
      name: 'Furniture',
      nameCs: 'Nábytek',
      slug: 'nabytek',
      description: 'Home furniture',
      descriptionCs: 'Nábytek do domácnosti',
      order: 1,
      isActive: true,
      parentId: createdCategories['dum-zahrada'].id
    },
    {
      name: 'Garden Tools',
      nameCs: 'Zahradní nářadí',
      slug: 'zahradni-naradi',
      description: 'Tools for gardening',
      descriptionCs: 'Nářadí pro zahradu',
      order: 2,
      isActive: true,
      parentId: createdCategories['dum-zahrada'].id
    },
    // Sports subcategories
    {
      name: 'Fitness',
      nameCs: 'Fitness',
      slug: 'fitness',
      description: 'Fitness equipment',
      descriptionCs: 'Fitness vybavení',
      order: 1,
      isActive: true,
      parentId: createdCategories['sport'].id
    },
    {
      name: 'Outdoor Sports',
      nameCs: 'Venkovní sporty',
      slug: 'venkovni-sporty',
      description: 'Outdoor sports equipment',
      descriptionCs: 'Vybavení pro venkovní sporty',
      order: 2,
      isActive: true,
      parentId: createdCategories['sport'].id
    },
  ];

  console.log('\nSeeding subcategories...');

  for (const subcategory of subcategories) {
    await prisma.category.upsert({
      where: { slug: subcategory.slug },
      update: subcategory,
      create: subcategory,
    });
    console.log(`✓ Created/Updated subcategory: ${subcategory.nameCs}`);
  }

  console.log('\nCategories seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });