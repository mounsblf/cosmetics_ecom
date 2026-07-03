/**
 * Script de données de test (seed) — base réelle.
 * Lancer : npm run seed   (charge .env.local via `node --env-file`)
 */
import mongoose from "mongoose";
import { seedDatabase } from "../src/lib/seed";

seedDatabase()
  .then(async ({ units, boxes }) => {
    console.log(`✅ Seed terminé : ${units} produits, ${boxes} coffrets.`);
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("❌ Échec du seed :", err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
