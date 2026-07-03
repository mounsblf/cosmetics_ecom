/** Types « sérialisés » (objets simples) utilisés côté UI, sans Mongoose. */

export type ProductType = "unit" | "box";
export type BoxSize = "Petit" | "Moyen" | "Grand";

export interface BaseProduct {
  id: string;
  type: ProductType;
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  price: number; // en EUR
  sku: string;
  stock: number;
  isActive: boolean;
}

export interface UnitProduct extends BaseProduct {
  type: "unit";
  ingredients: string[];
}

export interface BoxContentItem {
  name: string;
  slug: string;
  quantity: number;
}

export interface BoxProduct extends BaseProduct {
  type: "box";
  boxSize: BoxSize;
  contents: BoxContentItem[];
}

export type Product = UnitProduct | BoxProduct;
