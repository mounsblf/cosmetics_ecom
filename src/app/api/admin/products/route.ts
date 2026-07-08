import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";

/** Génère un slug URL-safe à partir d'un nom. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface CreateBody {
  type?: "unit" | "box";
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  stock?: number;
  ingredients?: string[];
  boxSize?: "Petit" | "Moyen" | "Grand";
  contents?: Array<{ id: string; quantity: number }>;
}

/** POST /api/admin/products — crée un produit à l'unité ou un coffret. */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as CreateBody;

  if (!body.type || !body.name || body.price == null || body.price < 0) {
    return NextResponse.json(
      { error: "Champs requis : type, nom, prix." },
      { status: 400 },
    );
  }
  if (body.type === "box" && (!body.boxSize || !body.contents?.length)) {
    return NextResponse.json(
      { error: "Un coffret nécessite une taille et au moins un produit." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    // Slug unique (suffixe numérique si déjà pris)
    const base = slugify(body.name);
    let slug = base;
    for (let n = 2; await Product.exists({ slug }); n++) {
      slug = `${base}-${n}`;
    }

    const doc = await Product.create({
      type: body.type,
      name: body.name.trim(),
      slug,
      category: body.type === "box" ? "Coffrets" : (body.category ?? "").trim(),
      description: (body.description ?? "").trim(),
      price: body.price,
      stock: body.stock ?? 0,
      sku: `NUR-${slug.toUpperCase().replace(/-/g, "").slice(0, 10)}`,
      isActive: true,
      ...(body.type === "unit"
        ? { ingredients: body.ingredients ?? [] }
        : {
            boxSize: body.boxSize,
            contents: (body.contents ?? []).map((c) => ({
              product: c.id,
              quantity: Math.max(1, c.quantity || 1),
            })),
          }),
    });

    return NextResponse.json({ ok: true, id: String(doc._id), slug });
  } catch (error) {
    console.error("[POST /api/admin/products]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
