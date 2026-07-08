import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { getCurrentUser } from "@/lib/userAuth";

// Pays de livraison autorisés (Union européenne)
const EU_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    "FR", "BE", "LU", "DE", "NL", "ES", "IT", "PT", "IE", "AT",
    "FI", "GR", "PL", "SE", "DK", "CZ", "SK", "SI", "HU", "RO",
    "BG", "HR", "EE", "LV", "LT", "CY", "MT",
  ];

interface CheckoutBody {
  items?: Array<{ id: string; quantity: number }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const requested = (body.items ?? []).filter(
      (i) => i.id && i.quantity > 0,
    );

    if (requested.length === 0) {
      return NextResponse.json({ error: "Panier vide." }, { status: 400 });
    }

    await connectToDatabase();

    // Récupère les produits réels (source de vérité pour prix + stock)
    const ids = requested.map((i) => i.id);
    const products = await Product.find({
      _id: { $in: ids },
      isActive: true,
    }).lean();

    const byId = new Map(products.map((p) => [String(p._id), p]));

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItems = [];
    let amountTotal = 0;

    for (const item of requested) {
      const product = byId.get(item.id);
      if (!product) {
        return NextResponse.json(
          { error: "Un article n'est plus disponible." },
          { status: 400 },
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour « ${product.name} ».` },
          { status: 400 },
        );
      }

      amountTotal += product.price * item.quantity;

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(product.price * 100), // en centimes
          product_data: {
            name: product.name,
            metadata: { slug: product.slug },
          },
        },
      });

      orderItems.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        type: product.type,
        unitPrice: product.price,
        quantity: item.quantity,
      });
    }

    // Client connecté ? (facultatif — l'achat invité reste possible)
    const user = await getCurrentUser();

    // Crée la commande en attente (avant paiement)
    const order = await Order.create({
      ...(user ? { user: user.id, customerEmail: user.email } : {}),
      items: orderItems,
      amountTotal,
      currency: "eur",
      status: "pending",
    });

    const origin =
      request.headers.get("origin") ?? new URL(request.url).origin;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // E-mail prérempli sur la page Stripe pour un client connecté
      ...(user ? { customer_email: user.email } : {}),
      shipping_address_collection: { allowed_countries: EU_COUNTRIES },
      metadata: { orderId: String(order._id) },
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[POST /api/checkout]", error);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 },
    );
  }
}
