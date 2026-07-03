import { connectToDatabase } from "./db";
import { Product as ProductModel } from "../models/Product";
import type {
  Product,
  BoxProduct,
  BoxContentItem,
  BoxSize,
} from "../types/product";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Transforme un document Mongoose (lean) en objet simple typé pour l'UI. */
function serialize(doc: any): Product {
  const base = {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
    category: doc.category ?? "",
    images: doc.images ?? [],
    price: doc.price,
    sku: doc.sku ?? "",
    stock: doc.stock ?? 0,
    isActive: doc.isActive ?? true,
  };

  if (doc.type === "box") {
    const contents: BoxContentItem[] = (doc.contents ?? [])
      .filter((c: any) => c.product) // ignore les références cassées
      .map((c: any) => ({
        name: c.product.name,
        slug: c.product.slug,
        quantity: c.quantity,
      }));

    return {
      ...base,
      type: "box",
      boxSize: doc.boxSize as BoxSize,
      contents,
    };
  }

  return {
    ...base,
    type: "unit",
    ingredients: doc.ingredients ?? [],
  };
}

/** Tous les articles actifs (produits + coffrets), filtre optionnel par catégorie. */
export async function getAllProducts(category?: string): Promise<Product[]> {
  await connectToDatabase();
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;

  const docs = await ProductModel.find(filter)
    .sort({ type: 1, name: 1 })
    .lean();
  return docs.map(serialize);
}

/** Uniquement les coffrets actifs. */
export async function getBoxes(): Promise<BoxProduct[]> {
  await connectToDatabase();
  const docs = await ProductModel.find({ type: "box", isActive: true })
    .populate("contents.product", "name slug")
    .sort({ price: 1 })
    .lean();
  return docs.map(serialize) as BoxProduct[];
}

/** Un article par son slug (coffret : contenu peuplé). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connectToDatabase();
  const doc = await ProductModel.findOne({ slug, isActive: true })
    .populate("contents.product", "name slug")
    .lean();
  return doc ? serialize(doc) : null;
}

/** Liste des catégories distinctes des produits à l'unité (pour les filtres boutique). */
export async function getCategories(): Promise<string[]> {
  await connectToDatabase();
  const cats = await ProductModel.distinct("category", {
    isActive: true,
    type: "unit",
    category: { $ne: "" },
  });
  return (cats as string[]).sort();
}
