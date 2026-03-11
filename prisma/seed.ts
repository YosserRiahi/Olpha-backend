/**
 * Seed script — creates the default admin account if it doesn't exist.
 *
 * Usage:
 *   npx ts-node prisma/seed.ts
 *
 * You can override defaults with env vars:
 *   ADMIN_EMAIL=me@example.com ADMIN_PASSWORD=secret123 npx ts-node prisma/seed.ts
 */

import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'admin@olpha.tn';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@1234';
const ADMIN_NAME     = process.env.ADMIN_NAME     ?? 'Olpha Admin';

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    if (existing.role === UserRole.ADMIN) {
      console.log(`✔  Admin already exists: ${ADMIN_EMAIL}`);
    } else {
      // Promote existing account to ADMIN
      await prisma.user.update({
        where: { email: ADMIN_EMAIL },
        data: { role: UserRole.ADMIN, sellerStatus: null },
      });
      console.log(`✔  Promoted ${ADMIN_EMAIL} → ADMIN`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: ADMIN_NAME,
      role: UserRole.ADMIN,
      sellerStatus: null,
    },
  });

  console.log(`✔  Admin account created`);
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`\n⚠️  Change the password after first login!`);
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
