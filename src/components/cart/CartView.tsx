"use client";

import Link from "next/link";
import { useCart, type CartItem } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { RitualProgress } from "@/components/cart/RitualProgress";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/format";

function hrefFor(item: CartItem): string {
  return item.type === "box"
    ? `/coffrets/${item.slug}`
    : `/produits/${item.slug}`;
}

export function CartView() {
  const { items, loaded, updateQuantity, removeItem, subtotal, totalItems } =
    useCart();
  const { user, loaded: userLoaded } = useUser();

  // Évite le clignotement avant la lecture du localStorage
  if (!loaded) {
    return (
      <Container className="py-20">
        <p className="text-charcoal/40">Chargement du panier…</p>
      </Container>
    );
  }

  // Panier vide
  if (items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-4xl text-charcoal md:text-5xl">Votre panier</h1>
        <p className="mx-auto mt-5 max-w-sm text-charcoal/60">
          Votre panier est vide pour le moment.
        </p>
        <div className="mt-8">
          <ButtonLink href="/produits" size="lg">
            Découvrir la boutique
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14 md:py-20">
      <h1 className="text-4xl text-charcoal md:text-5xl">Votre panier</h1>
      <p className="mt-3 text-charcoal/60">
        {totalItems} article{totalItems > 1 ? "s" : ""}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* Liste des articles */}
        <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-6">
              <Link
                href={hrefFor(item)}
                className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-charcoal/10"
              >
                <ProductImage src={undefined} alt={item.name} seed={item.slug} />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link
                    href={hrefFor(item)}
                    className="font-medium text-charcoal hover:text-olive"
                  >
                    {item.name}
                  </Link>
                  <span className="text-charcoal/80">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-charcoal/45">
                  {item.type === "box" ? "Coffret" : "Soin"} ·{" "}
                  {formatPrice(item.price)} l&apos;unité
                </p>

                <div className="mt-auto flex items-center justify-between pt-4">
                  {/* Sélecteur de quantité */}
                  <div className="flex items-center rounded-full border border-charcoal/20">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stock > 0 && item.quantity >= item.stock}
                      className="flex h-9 w-9 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-charcoal/40 underline-offset-4 transition-colors hover:text-terracotta hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Récapitulatif */}
        <aside className="h-fit rounded-2xl border border-charcoal/10 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-medium text-charcoal">Récapitulatif</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Sous-total</dt>
              <dd className="text-charcoal">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Livraison</dt>
              <dd className="text-charcoal/50">Calculée à l&apos;étape suivante</dd>
            </div>
          </dl>
          <div className="mt-5 flex justify-between border-t border-charcoal/10 pt-4">
            <span className="font-medium text-charcoal">Total</span>
            <span className="font-medium text-charcoal">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Paiement sécurisé via Stripe Checkout */}
          <CheckoutButton />
          <p className="mt-3 text-center text-xs text-charcoal/45">
            Paiement sécurisé via Stripe · Livraison offerte
          </p>

          {/* Invité ou connecté : les deux fonctionnent */}
          {userLoaded && !user && (
            <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-center text-xs text-charcoal/60">
              Vous pouvez commander en invité, ou{" "}
              <Link
                href="/compte/connexion?next=/panier"
                className="text-olive underline underline-offset-4"
              >
                vous connecter
              </Link>{" "}
              pour retrouver vos commandes dans votre espace client.
            </p>
          )}
          {userLoaded && user && (
            <p className="mt-4 text-center text-xs text-charcoal/50">
              Connecté en tant que {user.email} — cette commande sera liée à
              votre compte.
            </p>
          )}

          <Link
            href="/produits"
            className="mt-5 block text-center text-sm text-olive hover:underline"
          >
            Continuer mes achats
          </Link>

          {/* Gamification : progression du rituel */}
          <RitualProgress items={items} />
        </aside>
      </div>
    </Container>
  );
}
