import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Votre panier",
};

export default function PanierPage() {
  return <CartView />;
}
