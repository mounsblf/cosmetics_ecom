import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { getBoxes } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Coffrets",
  description:
    "Nos coffrets pré-composés Petit, Moyen et Grand : des sélections de soins naturels marocains à offrir ou à s'offrir.",
};

export default async function CoffretsPage() {
  let boxes: Awaited<ReturnType<typeof getBoxes>> = [];
  try {
    boxes = await getBoxes();
  } catch (error) {
    console.error("[/coffrets] base indisponible :", error);
  }

  return (
    <Container className="py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="eyebrow text-olive">Nos coffrets</p>
        <h1 className="mt-4 text-4xl text-charcoal md:text-5xl">
          Trois formats, un même rituel
        </h1>
        <p className="mt-4 text-charcoal/70">
          Des sélections composées avec soin, du format découverte au coffret
          prestige.
        </p>
      </header>

      {boxes.length > 0 ? (
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {boxes.map((box) => (
            <ProductCard key={box.id} product={box} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-charcoal/60">
          Nos coffrets arrivent très bientôt.
        </p>
      )}
    </Container>
  );
}
