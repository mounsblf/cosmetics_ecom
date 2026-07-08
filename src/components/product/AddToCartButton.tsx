"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart, type CartItemInput } from "@/context/CartContext";

/** Positions d'envol des étincelles autour du bouton. */
const SPARKS = [
  { sx: "-42px", sy: "-34px" },
  { sx: "6px", sy: "-52px" },
  { sx: "46px", sy: "-30px" },
  { sx: "-30px", sy: "26px" },
  { sx: "38px", sy: "22px" },
  { sx: "0px", sy: "-24px" },
];

/**
 * Sélecteur de quantité + bouton d'ajout au panier (or, action clé),
 * avec un jaillissement d'étincelles à l'ajout (feedback gamifié).
 */
export function AddToCartButton({ item }: { item: CartItemInput }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [burst, setBurst] = useState(0);

  const inStock = item.stock > 0;
  const max = item.stock > 0 ? item.stock : 1;

  function handleAdd() {
    addItem(item, qty);
    setAdded(true);
    setBurst((b) => b + 1); // relance l'animation d'étincelles
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

      <div className="relative">
        <Button
          variant="gold"
          size="lg"
          disabled={!inStock}
          onClick={handleAdd}
          aria-live="polite"
        >
          {!inStock ? "Épuisé" : added ? "Ajouté ✓" : "Ajouter au panier"}
        </Button>

        {/* Étincelles (relancées à chaque ajout via la key) */}
        {burst > 0 && (
          <span
            key={burst}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
                style={{
                  background: i % 2 ? "#d4af37" : "#d6a284",
                  ["--sx" as string]: s.sx,
                  ["--sy" as string]: s.sy,
                  animation: `sparkle-fly 0.7s ease-out ${i * 0.04}s both`,
                }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
