/**
 * Test de fumée de la couche données — SANS base externe.
 * Démarre un MongoDB en mémoire, seed, puis vérifie les requêtes
 * (liste, coffrets avec contenu peuplé, fiche par slug).
 *
 * Lancer : npm run smoke
 */
import { MongoMemoryServer } from "mongodb-memory-server";

async function main() {
  console.log("→ Démarrage de MongoDB en mémoire…");
  const mem = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mem.getUri();

  // Imports dynamiques APRÈS avoir défini MONGODB_URI
  const { seedDatabase } = await import("../src/lib/seed");
  const {
    getAllProducts,
    getBoxes,
    getProductBySlug,
    getCategories,
  } = await import("../src/lib/products");
  const mongoose = (await import("mongoose")).default;

  const counts = await seedDatabase();
  console.log(`→ Seed : ${counts.units} produits, ${counts.boxes} coffrets`);

  const all = await getAllProducts();
  const units = all.filter((p) => p.type === "unit");
  const categories = await getCategories();
  const boxes = await getBoxes();
  const prestige = await getProductBySlug("coffret-prestige");
  const argan = await getProductBySlug("huile-argan-pure");

  console.log("\n===== VÉRIFICATIONS =====");
  console.log("Articles totaux      :", all.length);
  console.log("Produits à l'unité   :", units.length);
  console.log("Coffrets             :", boxes.length);
  console.log("Catégories           :", categories.join(", "));

  console.log("\nExemple produit (huile-argan-pure) :");
  console.log("  nom      :", argan?.name);
  console.log("  prix     :", argan?.price, "MAD");
  console.log(
    "  ingrédients:",
    argan?.type === "unit" ? argan.ingredients.join(", ") : "—",
  );

  console.log("\nExemple coffret (coffret-prestige) — contenu peuplé :");
  if (prestige?.type === "box") {
    console.log("  taille   :", prestige.boxSize);
    console.log("  prix     :", prestige.price, "MAD");
    for (const item of prestige.contents) {
      console.log(`   • ${item.quantity}× ${item.name}  (${item.slug})`);
    }
  }

  // Assertions simples
  const ok =
    all.length === counts.units + counts.boxes &&
    boxes.length === 3 &&
    prestige?.type === "box" &&
    prestige.contents.length === 5 &&
    prestige.contents.every((c) => !!c.name);

  console.log("\nRésultat :", ok ? "✅ TOUT EST OK" : "❌ ÉCHEC");

  await mongoose.disconnect();
  await mem.stop();
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error("❌ Erreur du test de fumée :", err);
  process.exit(1);
});
