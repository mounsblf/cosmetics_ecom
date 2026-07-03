import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * Modèle unique pour les produits à l'unité ET les coffrets,
 * distingués par le champ `type` (cf. charte §10).
 * - type "unit" : produit cosmétique vendu seul (a des `ingredients`)
 * - type "box"  : coffret pré-composé (a un `boxSize` et un `contents`)
 */

const ContentItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    type: { type: String, enum: ["unit", "box"], required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    images: { type: [String], default: [] },

    // Prix en EUR, stock et référence propres à l'article
    price: { type: Number, required: true, min: 0 },
    sku: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },

    // --- Spécifique type "unit" ---
    ingredients: { type: [String], default: undefined },

    // --- Spécifique type "box" ---
    boxSize: { type: String, enum: ["Petit", "Moyen", "Grand"] },
    contents: { type: [ContentItemSchema], default: undefined },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;

export const Product =
  (models.Product as mongoose.Model<ProductDoc>) ||
  model<ProductDoc>("Product", ProductSchema);
