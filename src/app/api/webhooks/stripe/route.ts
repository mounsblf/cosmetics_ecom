import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { sendOrderEmails } from "@/lib/email";

/**
 * Webhook Stripe — SEULE source de vérité pour confirmer un paiement.
 * Vérifie la signature, puis marque la commande payée et décrémente le stock.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET manquant");
    return NextResponse.json({ error: "Config manquante." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente." }, { status: 400 });
  }

  // Corps brut requis pour la vérification de signature
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[webhook] signature invalide", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    try {
      await connectToDatabase();
      const order = orderId ? await Order.findById(orderId) : null;

      if (order && order.status !== "paid") {
        order.status = "paid";
        order.customerEmail = session.customer_details?.email ?? "";
        await order.save();

        // Décrément du stock (le coffret a son propre stock)
        for (const item of order.items) {
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: -item.quantity } },
          );
        }
        console.log(`[webhook] commande ${orderId} payée`);

        // Emails de confirmation (ne bloque pas / ne fait pas échouer le webhook)
        await sendOrderEmails({
          id: String(order._id),
          customerEmail: order.customerEmail,
          amountTotal: order.amountTotal,
          items: order.items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        });
      }
    } catch (error) {
      console.error("[webhook] erreur traitement commande", error);
      // On renvoie 500 pour que Stripe réessaie
      return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
