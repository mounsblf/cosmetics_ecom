import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";

const BASE_URL = "https://cosmetics-ecom.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/produits",
    "/coffrets",
    "/a-propos",
    "/contact",
    "/livraison",
    "/cgv",
    "/mentions-legales",
    "/confidentialite",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" || path === "/produits" ? "weekly" : "monthly",
  }));

  // Fiches produits / coffrets (best-effort si la base est indisponible)
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productPages = products.map((p) => ({
      url: `${BASE_URL}${p.type === "box" ? "/coffrets" : "/produits"}/${p.slug}`,
      changeFrequency: "weekly" as const,
    }));
  } catch (error) {
    console.error("[sitemap] base indisponible :", error);
  }

  return [...staticPages, ...productPages];
}
