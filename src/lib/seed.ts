import mongoose from "mongoose";
import { connectToDatabase } from "./db";
import { Product } from "../models/Product";

/**
 * Données de test + logique de peuplement, réutilisables par :
 * - le script CLI `npm run seed` (base réelle)
 * - le test de fumée en base mémoire
 */

// --- Produits à l'unité ---
export const UNITS = [
  {
    slug: "huile-argan-pure",
    name: "Huile d'Argan Pure",
    category: "Visage",
    price: 24,
    stock: 40,
    description:
      "L'or liquide du Maroc, pressé à froid. Nourrit, répare et sublime la peau comme les cheveux.",
    ingredients: ["Huile d'argan 100 %", "Vitamine E"],
  },
  {
    slug: "ghassoul-purifiant",
    name: "Ghassoul Argile Purifiante",
    category: "Visage",
    price: 12,
    stock: 60,
    description:
      "Argile volcanique de l'Atlas qui purifie en douceur et resserre les pores.",
    ingredients: ["Ghassoul", "Eau de rose"],
  },
  {
    slug: "savon-noir-beldi",
    name: "Savon Noir Beldi",
    category: "Corps",
    price: 9,
    stock: 80,
    description:
      "Pâte d'olive traditionnelle du hammam, pour une peau lisse et régénérée.",
    ingredients: ["Savon noir", "Huile d'olive", "Eucalyptus"],
  },
  {
    slug: "eau-de-rose-dades",
    name: "Eau de Rose du Dadès",
    category: "Visage",
    price: 14,
    stock: 50,
    description:
      "Distillée à partir des roses de la vallée du Dadès. Tonifie et apaise.",
    ingredients: ["Eau de rose de Damas"],
  },
  {
    slug: "baume-levres-argan-miel",
    name: "Baume à Lèvres Argan & Miel",
    category: "Visage",
    price: 8,
    stock: 100,
    description: "Un baume fondant qui nourrit et protège les lèvres sensibles.",
    ingredients: ["Argan", "Cire d'abeille", "Miel"],
  },
  {
    slug: "gommage-noyaux-argan",
    name: "Gommage Corps aux Noyaux d'Argan",
    category: "Corps",
    price: 18,
    stock: 45,
    description:
      "Exfoliant naturel qui affine le grain de peau et révèle son éclat.",
    ingredients: ["Poudre de noyaux d'argan", "Huile d'argan", "Sucre"],
  },
  {
    slug: "masque-cheveux-argan-figue",
    name: "Masque Cheveux Argan & Figue de Barbarie",
    category: "Cheveux",
    price: 19,
    stock: 35,
    description:
      "Un soin profond qui répare les longueurs et discipline les cheveux secs.",
    ingredients: ["Argan", "Huile de figue de barbarie", "Kératine végétale"],
  },
  {
    slug: "huile-figue-de-barbarie",
    name: "Huile de Figue de Barbarie",
    category: "Visage",
    price: 39,
    stock: 20,
    description:
      "Le trésor anti-âge du Sud marocain, riche en vitamine E, pour une peau raffermie.",
    ingredients: ["Huile de figue de barbarie 100 %"],
  },
];

// --- Coffrets (contenu défini par référence de slug) ---
export const BOXES = [
  {
    slug: "coffret-decouverte",
    name: "Coffret Découverte",
    boxSize: "Petit" as const,
    price: 32,
    stock: 25,
    description:
      "Le rituel essentiel pour s'initier aux soins marocains. Idéal en cadeau.",
    contents: [
      { slug: "ghassoul-purifiant", quantity: 1 },
      { slug: "savon-noir-beldi", quantity: 1 },
      { slug: "eau-de-rose-dades", quantity: 1 },
    ],
  },
  {
    slug: "coffret-signature",
    name: "Coffret Signature",
    boxSize: "Moyen" as const,
    price: 55,
    stock: 20,
    description: "Une routine complète visage et corps, entre pureté et éclat.",
    contents: [
      { slug: "huile-argan-pure", quantity: 1 },
      { slug: "ghassoul-purifiant", quantity: 1 },
      { slug: "eau-de-rose-dades", quantity: 1 },
      { slug: "baume-levres-argan-miel", quantity: 1 },
    ],
  },
  {
    slug: "coffret-prestige",
    name: "Coffret Prestige",
    boxSize: "Grand" as const,
    price: 89,
    stock: 12,
    description:
      "L'expérience intégrale : visage, corps et cheveux, dans un écrin d'exception.",
    contents: [
      { slug: "huile-argan-pure", quantity: 1 },
      { slug: "huile-figue-de-barbarie", quantity: 1 },
      { slug: "masque-cheveux-argan-figue", quantity: 1 },
      { slug: "gommage-noyaux-argan", quantity: 1 },
      { slug: "baume-levres-argan-miel", quantity: 1 },
    ],
  },
];

function sku(slug: string): string {
  return `NUR-${slug.toUpperCase().replace(/-/g, "").slice(0, 10)}`;
}

/** Vide la collection puis insère produits + coffrets. Retourne les compteurs. */
export async function seedDatabase(): Promise<{ units: number; boxes: number }> {
  await connectToDatabase();
  await Product.deleteMany({});

  // 1) Produits à l'unité
  const createdUnits = await Product.insertMany(
    UNITS.map((u) => ({
      type: "unit",
      ...u,
      sku: sku(u.slug),
      isActive: true,
    })),
  );

  const idBySlug = new Map<string, mongoose.Types.ObjectId>();
  for (const doc of createdUnits) {
    idBySlug.set(doc.slug, doc._id as mongoose.Types.ObjectId);
  }

  // 2) Coffrets (résolution des références de contenu)
  const boxDocs = BOXES.map((b) => ({
    type: "box",
    name: b.name,
    slug: b.slug,
    boxSize: b.boxSize,
    price: b.price,
    stock: b.stock,
    description: b.description,
    category: "Coffrets",
    sku: `NUR-BOX-${b.boxSize.toUpperCase()}`,
    isActive: true,
    contents: b.contents
      .map((c) => {
        const productId = idBySlug.get(c.slug);
        return productId ? { product: productId, quantity: c.quantity } : null;
      })
      .filter(Boolean),
  }));

  const createdBoxes = await Product.insertMany(boxDocs);

  return { units: createdUnits.length, boxes: createdBoxes.length };
}
