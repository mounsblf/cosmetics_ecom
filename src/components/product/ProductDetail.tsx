import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { ArchMotif } from "@/components/decor/ArchMotif";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

/** Fiche détaillée d'un article (produit à l'unité ou coffret). */
export function ProductDetail({ product }: { product: Product }) {
  const inStock = product.stock > 0;

  return (
    <Container className="py-14 md:py-20">
      {/* Fil d'Ariane simple */}
      <nav className="mb-8 text-sm text-charcoal/50">
        <Link href="/" className="hover:text-charcoal">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        {product.type === "box" ? (
          <Link href="/coffrets" className="hover:text-charcoal">
            Coffrets
          </Link>
        ) : (
          <Link href="/produits" className="hover:text-charcoal">
            Boutique
          </Link>
        )}
        <span className="mx-2">/</span>
        <span className="text-charcoal/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        {/* Visuel */}
        <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-charcoal/10">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            seed={product.slug}
          />
        </div>

        {/* Informations */}
        <div className="flex flex-col">
          <p className="eyebrow text-terracotta">
            {product.type === "box"
              ? `Coffret ${product.boxSize}`
              : product.category || "Soin"}
          </p>
          <h1 className="mt-4 text-4xl text-charcoal md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl text-charcoal/90">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-6 leading-relaxed text-charcoal/70">
              {product.description}
            </p>
          )}

          {/* Contenu d'un coffret */}
          {product.type === "box" && product.contents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium uppercase tracking-wider text-charcoal/50">
                Ce coffret contient
              </h2>
              <ul className="mt-4 divide-y divide-charcoal/10 border-y border-charcoal/10">
                {product.contents.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-center justify-between py-3"
                  >
                    <Link
                      href={`/produits/${item.slug}`}
                      className="text-charcoal/80 hover:text-charcoal"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm text-charcoal/50">
                      ×{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingrédients d'un produit à l'unité */}
          {product.type === "unit" && product.ingredients.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium uppercase tracking-wider text-charcoal/50">
                Ingrédients clés
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full border border-charcoal/15 px-3 py-1 text-sm text-charcoal/70"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action d'achat (branchée au panier en P3) */}
          <div className="mt-10 flex items-center gap-4">
            <Button variant="gold" size="lg" disabled={!inStock}>
              {inStock ? "Ajouter au panier" : "Épuisé"}
            </Button>
            {inStock && (
              <span className="text-sm text-charcoal/50">
                {product.stock} en stock
              </span>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-charcoal/50">
            <ArchMotif className="h-6 w-auto text-terracotta/60" />
            <span>Fabriqué avec soin au Maroc</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
