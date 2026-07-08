import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import type { AdminProduct } from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin · Produits" };

async function getProducts(): Promise<AdminProduct[]> {
  try {
    await connectToDatabase();
    const docs = await Product.find().sort({ type: 1, name: 1 }).lean();
    return docs.map((p) => ({
      id: String(p._id),
      type: p.type as "unit" | "box",
      name: p.name,
      slug: p.slug,
      category: p.category ?? "",
      price: p.price,
      stock: p.stock ?? 0,
      isActive: p.isActive ?? true,
      boxSize: (p.boxSize as string) ?? "",
    }));
  } catch (error) {
    console.error("[admin/produits]", error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <Container className="py-10">
      <h1 className="text-3xl text-charcoal">Produits & coffrets</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Modifie les prix et stocks, masque un article, ou crée-en un nouveau.
      </p>
      <ProductsManager initial={products} />
    </Container>
  );
}
