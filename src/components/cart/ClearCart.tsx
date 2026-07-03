"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Vide le panier au montage (après un paiement réussi). */
export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
