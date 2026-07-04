/**
 * Liste les dernières commandes (outil d'admin en ligne de commande).
 * Lancer : npm run orders
 */
import mongoose from "mongoose";
import { connectToDatabase } from "../src/lib/db";
import { Order } from "../src/models/Order";

async function main() {
  await connectToDatabase();
  const orders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();

  console.log(`→ ${orders.length} dernière(s) commande(s) :\n`);
  for (const o of orders) {
    const items = (o.items ?? [])
      .map((i) => `${i.quantity}× ${i.name}`)
      .join(", ");
    console.log(
      `[${o.status?.toUpperCase()}] ${o.amountTotal} € — ${o.customerEmail || "—"}\n` +
        `   ${items}\n` +
        `   ${o.createdAt ? new Date(o.createdAt).toLocaleString("fr-FR") : ""}\n`,
    );
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
