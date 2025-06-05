const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.order.findMany({
  orderBy: { createdAt: 'desc' },
  take: 5
}).then(orders => {
  console.log(`Found ${orders.length} orders:`);
  orders.forEach(o => console.log(`- ${o.orderNumber}: ${o.name} (${o.status})`));
}).finally(() => prisma.$disconnect());
