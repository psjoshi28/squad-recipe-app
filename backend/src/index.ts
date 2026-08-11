import { createServer } from './server';
import envConfig from './config/env-config';
import { initializeDatabase } from './db/db-init';

const PORT = envConfig.port ?? 3000;

async function main() {
  await initializeDatabase();
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`Recipe API running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
