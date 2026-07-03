"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

/** Lance la session Stripe Checkout et redirige vers la page de paiement hébergée. */
export function CheckoutButton() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Une erreur est survenue.");
      }
      window.location.href = data.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="gold"
        size="lg"
        className="mt-6 w-full"
        disabled={loading || items.length === 0}
        onClick={handleCheckout}
      >
        {loading ? "Redirection…" : "Passer au paiement"}
      </Button>
      {error && (
        <p className="mt-2 text-center text-xs text-terracotta">{error}</p>
      )}
    </>
  );
}
