/**
 * Base MongoDB en mémoire PERSISTANTE (port fixe) + seed.
 * Sert uniquement à la vérification locale (le serveur de dev s'y connecte).
 * Reste en vie jusqu'à interruption (Ctrl-C / kill).
 *
 * Lancer : npm run dev:db
 */
import { MongoMemoryServer } from "mongodb-memory-server";

const PORT = 47017;
const URI = `mongodb://127.0.0.1:${PORT}/nur`;

async function main() {
  const mem = await MongoMemoryServer.create({
    instance: { port: PORT, dbName: "nur" },
  });

  process.env.MONGODB_URI = URI;
  const { seedDatabase } = await import("../src/lib/seed");
  const counts = await seedDatabase();

  console.log(`READY ${URI}`);
  console.log(`Seed : ${counts.units} produits, ${counts.boxes} coffrets`);

  const shutdown = async () => {
    await mem.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Maintenir le processus en vie
  await new Promise<void>(() => {});
}

main().catch((err) => {
  console.error("dev-db error:", err);
  process.exit(1);
});
