import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/** Ligne de commande : instantané de l'article au moment de l'achat. */
const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, enum: ["unit", "box"], required: true },
    unitPrice: { type: Number, required: true }, // EUR
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    // Client connecté (absent pour un achat invité)
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], required: true },
    amountTotal: { type: Number, required: true }, // EUR
    currency: { type: String, default: "eur" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    stripeSessionId: { type: String, index: true },
    customerEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof OrderSchema>;

export const Order =
  (models.Order as mongoose.Model<OrderDoc>) ||
  model<OrderDoc>("Order", OrderSchema);
