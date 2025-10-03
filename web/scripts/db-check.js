const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const tours = await prisma.tour.count();
  const users = await prisma.user.count();
  const departures = await prisma.departure.count();
  console.log(JSON.stringify({ tours, users, departures }));
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
