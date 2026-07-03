/**
 * Test de bout en bout du webhook Stripe — SANS paiement réel.
 * Crée une commande de test, envoie un événement `checkout.session.completed`
 * SIGNÉ au endpoint local, puis vérifie : commande payée + stock décrémenté.
 *
 * Prérequis : le serveur de dev doit tourner (npm run dev) avec le même
 * STRIPE_WEBHOOK_SECRET que celui utilisé ici.
 *
 * Lancer : npm run test:webhook
 */
import mongoose from "mongoose";
import { connectToDatabase } from "../src/lib/db";
import { Product } from "../src/models/Product";
import { Order } from "../src/models/Order";
import { getStripe } from "../src/lib/stripe";

const ENDPOINT = "http://localhost:3000/api/webhooks/stripe";

async function main() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET manquant dans .env.local");

  await connectToDatabase();

  // 1) Choisir un produit et créer une commande de test (pending)
  const product = await Product.findOne({ type: "unit", isActive: true });
  if (!product) throw new Error("Aucun produit trouvé (as-tu lancé le seed ?)");
  const stockBefore = product.stock ?? 0;

  const order = await Order.create({
    items: [
      {
        product: product._id,
        name: product.name,
        slug: product.slug,
        type: "unit",
        unitPrice: product.price,
        quantity: 1,
      },
    ],
    amountTotal: product.price,
    currency: "eur",
    status: "pending",
    stripeSessionId: "cs_test_fake",
  });

  console.log(`→ Commande test ${order._id} créée (pending)`);
  console.log(`→ Produit "${product.name}" — stock avant : ${stockBefore}`);

  // 2) Construire l'événement checkout.session.completed
  const event = {
    id: "evt_test_webhook",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_fake",
        object: "checkout.session",
        amount_total: product.price * 100,
        currency: "eur",
        customer_details: { email: "client-test@example.com" },
        metadata: { orderId: String(order._id) },
      },
    },
  };
  const payload = JSON.stringify(event);

  // 3) Signer l'événement comme le ferait Stripe
  const header = getStripe().webhooks.generateTestHeaderString({
    payload,
    secret,
  });

  // 4) Envoyer au endpoint local
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": header,
    },
    body: payload,
  });
  console.log(`→ Webhook répond : HTTP ${res.status}`);

  // 5) Vérifier les effets
  const updatedOrder = await Order.findById(order._id);
  const updatedProduct = await Product.findById(product._id);
  const stockAfter = updatedProduct?.stock ?? 0;

  const ok =
    res.status === 200 &&
    updatedOrder?.status === "paid" &&
    updatedOrder?.customerEmail === "client-test@example.com" &&
    stockAfter === stockBefore - 1;

  console.log("\n===== VÉRIFICATIONS =====");
  console.log("Statut commande :", updatedOrder?.status, "(attendu: paid)");
  console.log("Email client    :", updatedOrder?.customerEmail);
  console.log(`Stock : ${stockBefore} → ${stockAfter} (attendu: ${stockBefore - 1})`);
  console.log("\nRésultat :", ok ? "✅ WEBHOOK OK" : "❌ ÉCHEC");

  // 6) Nettoyage : supprimer la commande test et restaurer le stock
  await Order.deleteOne({ _id: order._id });
  await Product.updateOne({ _id: product._id }, { $set: { stock: stockBefore } });
  console.log("→ Nettoyage effectué (commande supprimée, stock restauré).");

  await mongoose.disconnect();
  process.exit(ok ? 0 : 1);
}

main().catch(async (err) => {
  console.error("❌ Erreur test webhook :", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
