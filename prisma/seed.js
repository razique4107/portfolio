import prisma from '../server/db.js';
import { seedDatabase } from './seed-data.js';

const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

seedDatabase(prisma, adminEmail, adminPassword)
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
