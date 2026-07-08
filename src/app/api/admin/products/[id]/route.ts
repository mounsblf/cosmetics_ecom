import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";

interface PatchBody {
  price?: number;
  stock?: number;
  isActive?: boolean;
}

/** PATCH /api/admin/products/[id] — met à jour prix / stock / visibilité. */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/products/[id]">,
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as PatchBody;

  const update: Record<string, unknown> = {};
  if (typeof body.price === "number" && body.price >= 0) update.price = body.price;
  if (typeof body.stock === "number" && body.stock >= 0) update.stock = body.stock;
  if (typeof body.isActive === "boolean") update.isActive = body.isActive;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Rien à mettre à jour." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const updated = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/admin/products]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
