"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProductType } from "@/types/product";

const STORAGE_KEY = "nur-cart";

export interface CartItem {
  id: string; // identifiant produit
  slug: string;
  name: string;
  price: number; // EUR
  type: ProductType;
  stock: number;
  quantity: number;
}

/** Donnée minimale nécessaire pour ajouter un article au panier. */
export type CartItemInput = Omit<CartItem, "quantity">;

interface CartContextValue {
  items: CartItem[];
  loaded: boolean;
  addItem: (item: CartItemInput, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function clamp(qty: number, stock: number): number {
  const max = stock > 0 ? stock : Infinity;
  return Math.max(1, Math.min(qty, max));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Chargement initial depuis localStorage (côté client uniquement)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // stockage indisponible / JSON invalide → panier vide
    }
    setLoaded(true);
  }, []);

  // Persistance à chaque changement (après le chargement initial)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // quota / stockage indisponible → on ignore
    }
  }, [items, loaded]);

  const addItem = useCallback((item: CartItemInput, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: clamp(i.quantity + quantity, i.stock) }
            : i,
        );
      }
      return [...prev, { ...item, quantity: clamp(quantity, item.stock) }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: clamp(quantity, i.stock) } : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { totalItems, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        totalItems: acc.totalItems + i.quantity,
        subtotal: acc.subtotal + i.price * i.quantity,
      }),
      { totalItems: 0, subtotal: 0 },
    );
  }, [items]);

  const value: CartContextValue = {
    items,
    loaded,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé dans un <CartProvider>.");
  }
  return ctx;
}
