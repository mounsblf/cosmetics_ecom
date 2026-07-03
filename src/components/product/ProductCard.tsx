import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

/** Carte d'un article (produit à l'unité ou coffret) dans une grille. */
export function ProductCard({ product }: { product: Product }) {
  const href =
    product.type === "box"
      ? `/coffrets/${product.slug}`
      : `/produits/${product.slug}`;

  const label = product.type === "box" ? "Coffret" : product.category;

  return (
    <Link href={href} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-charcoal/10">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          seed={product.slug}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs text-charcoal/70">
            Épuisé
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          {label && (
            <p className="text-xs uppercase tracking-wider text-charcoal/45">
              {label}
            </p>
          )}
          <h3 className="mt-1 font-sans text-base font-medium text-charcoal">
            {product.name}
          </h3>
        </div>
        <span className="shrink-0 text-sm text-charcoal/80">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}
