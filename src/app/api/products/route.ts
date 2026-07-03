import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

/**
 * GET /api/products
 * Retourne tous les articles actifs (produits + coffrets).
 * Filtre optionnel : ?categorie=Visage
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorie = searchParams.get("categorie") ?? undefined;

  try {
    const products = await getAllProducts(categorie);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les produits." },
      { status: 500 },
    );
  }
}
