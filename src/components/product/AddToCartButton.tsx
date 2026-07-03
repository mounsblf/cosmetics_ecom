"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart, type CartItemInput } from "@/context/CartContext";

/**
 * Sélecteur de quantité + bouton d'ajout au panier (or, action clé).
 * Permet d'ajouter un ou plusieurs exemplaires en une fois.
 */
export function AddToCartButton({ item }: { item: CartItemInput }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = item.stock > 0;
  const max = item.stock > 0 ? item.stock : 1;

  function handleAdd() {
    addItem(item, qty);
    setAdded(true);
    setQty(1);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {inStock && (
        <div className="flex items-center rounded-full border border-charcoal/20">
          <button
            type="button"
            aria-label="Diminuer la quantité"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="flex h-11 w-11 items-center justify-center text-lg text-charcoal/70 transition-colors hover:text-charcoal disabled:opacity-30"
          >
            −
          </button>
          <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
          <button
            type="button"
            aria-label="Augmenter la quantité"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={qty >= max}
            className="flex h-11 w-11 items-center justify-center text-lg text-charcoal/70 transition-colors hover:text-charcoal disabled:opacity-30"
          >
            +
          </button>
        </div>
      )}

      <Button
        variant="gold"
        size="lg"
        disabled={!inStock}
        onClick={handleAdd}
        aria-live="polite"
      >
        {!inStock ? "Épuisé" : added ? "Ajouté ✓" : "Ajouter au panier"}
      </Button>
    </div>
  );
}
