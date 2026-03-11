import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function main() {
  // Ensure DB is reachable before accepting traffic
  await prisma.$connect();
  console.log('Database connected');

  app.listen(env.port, () => {
    console.log(`Olpha API running on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
