import { PrismaClient, Role, Difficulty } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!@#', 10);
  const customerPasswordHash = await bcrypt.hash('Customer123!@#', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      hashedPassword: adminPasswordHash,
      role: 'ADMIN' as Role,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Customer One',
      hashedPassword: customerPasswordHash,
      role: 'CUSTOMER' as Role,
    },
  });

  const toursData = [
    {
      slug: 'malaysia-10-days-explorer',
      title: 'Malaysia 10 Days Explorer',
      subtitle: 'Kuala Lumpur, Penang, Langkawi',
      summary: 'Discover Malaysia in 10 days with city and island highlights.',
      description: 'An immersive 10-day journey through Malaysia\'s vibrant cities and serene islands. Includes guided tours, cultural experiences, and free time to explore.',
      country: 'Malaysia',
      region: 'Southeast Asia',
      durationDays: 10,
      difficulty: 'EASY' as Difficulty,
      minAge: 8,
      maxGroupSize: 16,
      priceCents: 179900,
      currency: 'USD',
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          { url: '/sample/malaysia/hero.jpg', alt: 'Malaysia skyline at dusk', position: 0 },
          { url: '/sample/malaysia/beach.jpg', alt: 'Langkawi beach', position: 1 },
          { url: '/sample/malaysia/street.jpg', alt: 'George Town street art', position: 2 },
        ],
      },
      departures: {
        create: [
          { startDate: new Date('2025-11-05'), endDate: new Date('2025-11-15'), slotsTotal: 16, slotsAvailable: 16 },
          { startDate: new Date('2026-01-10'), endDate: new Date('2026-01-20'), slotsTotal: 16, slotsAvailable: 16 },
        ],
      },
    },
    {
      slug: 'nepal-8-days-trek',
      title: 'Nepal 8 Days Trek',
      subtitle: 'Kathmandu and Himalayan foothills',
      summary: 'A moderate trek suitable for beginners with stunning Himalayan views.',
      description: 'Experience Nepal\'s rich culture and breathtaking mountain scenery on a moderate 8-day trek. Includes teahouse stays and local guides.',
      country: 'Nepal',
      region: 'South Asia',
      durationDays: 8,
      difficulty: 'MODERATE' as Difficulty,
      minAge: 12,
      maxGroupSize: 12,
      priceCents: 129900,
      currency: 'USD',
      isActive: true,
      isFeatured: true,
      images: {
        create: [
          { url: '/sample/nepal/hero.jpg', alt: 'Himalayan sunrise', position: 0 },
          { url: '/sample/nepal/trek.jpg', alt: 'Trail through forest', position: 1 },
          { url: '/sample/nepal/village.jpg', alt: 'Mountain village', position: 2 },
        ],
      },
      departures: {
        create: [
          { startDate: new Date('2025-10-20'), endDate: new Date('2025-10-28'), slotsTotal: 12, slotsAvailable: 12 },
          { startDate: new Date('2026-03-05'), endDate: new Date('2026-03-13'), slotsTotal: 12, slotsAvailable: 12 },
        ],
      },
    },
  ];

  for (const tour of toursData) {
    await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {},
      create: tour as any,
    });
  }

  console.log('Seed completed:', { admin: admin.email, customer: customer.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
