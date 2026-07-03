import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

async function safeGetProduct(slug: string) {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    console.error("[/coffrets/[slug]] base indisponible :", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await safeGetProduct(slug);
  if (!product) return { title: "Coffret introuvable" };
  return {
    title: product.name,
    description: product.description || undefined,
  };
}

export default async function CoffretPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await safeGetProduct(slug);

  // Cette page ne sert que les coffrets
  if (!product || product.type !== "box") notFound();

  return <ProductDetail product={product} />;
}
