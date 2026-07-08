import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

export const User =
  (models.User as mongoose.Model<UserDoc>) || model<UserDoc>("User", UserSchema);
