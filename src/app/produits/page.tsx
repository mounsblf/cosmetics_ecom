import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllProducts, getCategories } from "@/lib/products";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

// Lecture en base à la requête (pas au build)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Tous nos soins cosmétiques naturels : visage, corps et cheveux, à base d'argan, ghassoul et plantes du Maroc.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  // Dégradation gracieuse si la base est injoignable (état vide plutôt que crash)
  let categories: string[] = [];
  let products: Product[] = [];
  try {
    const [cats, all] = await Promise.all([
      getCategories(),
      getAllProducts(categorie),
    ]);
    categories = cats;
    // La boutique liste les produits à l'unité (les coffrets ont leur page)
    products = all.filter((p) => p.type === "unit");
  } catch (error) {
    console.error("[/produits] base indisponible :", error);
  }

  return (
    <Container className="py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="eyebrow text-terracotta">La boutique</p>
        <h1 className="mt-4 text-4xl text-charcoal md:text-5xl">Nos soins</h1>
        <p className="mt-4 text-charcoal/70">
          Des formules naturelles, pensées comme un rituel essentiel.
        </p>
      </header>

      {/* Filtres par catégorie */}
      {categories.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          <FilterChip href="/produits" active={!categorie}>
            Tout
          </FilterChip>
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              href={`/produits?categorie=${encodeURIComponent(cat)}`}
              active={categorie === cat}
            >
              {cat}
            </FilterChip>
          ))}
        </div>
      )}

      {/* Grille produits */}
      {products.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-charcoal/60">
          Aucun produit pour l&apos;instant. Revenez bientôt !
        </p>
      )}
    </Container>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-charcoal bg-charcoal text-cream"
          : "border-charcoal/20 text-charcoal/70 hover:border-charcoal/50",
      )}
    >
      {children}
    </Link>
  );
}
