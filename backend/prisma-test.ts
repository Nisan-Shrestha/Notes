// prisma-test.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
    },
  });

  console.log('✅ Created user:', user);

  // Fetch all users
  const allUsers = await prisma.user.findMany();
  console.log('📄 All users in DB:', allUsers);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
