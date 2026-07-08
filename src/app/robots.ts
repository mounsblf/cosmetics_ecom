import type { MetadataRoute } from "next";

const BASE_URL = "https://cosmetics-ecom.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/panier", "/commande"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
