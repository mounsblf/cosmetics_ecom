import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";

const VALID_STATUSES = ["pending", "paid", "shipped", "cancelled"];

/** PATCH /api/admin/orders/[id] — change le statut d'une commande. */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/orders/[id]">,
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const updated = await Order.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true },
    );
    if (!updated) {
      return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, status: updated.status });
  } catch (error) {
    console.error("[PATCH /api/admin/orders]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
