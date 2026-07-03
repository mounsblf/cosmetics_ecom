import Stripe from "stripe";

/**
 * Client Stripe (initialisé paresseusement pour ne pas planter au build
 * si la clé n'est pas encore définie).
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY manquante. Ajoute-la dans .env.local (et sur Vercel).",
      );
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}
