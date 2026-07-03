import mongoose from "mongoose";

/**
 * Connexion MongoDB (Mongoose) avec mise en cache globale.
 * Évite d'ouvrir une nouvelle connexion à chaque hot-reload en dev
 * et à chaque invocation de fonction serverless en prod.
 */

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Cache stocké sur l'objet global (persiste entre les rechargements en dev)
const globalForMongoose = globalThis as unknown as {
  _mongoose?: MongooseCache;
};

const cached: MongooseCache =
  globalForMongoose._mongoose ?? { conn: null, promise: null };

globalForMongoose._mongoose = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "La variable d'environnement MONGODB_URI est manquante. " +
        "Ajoute-la dans .env.local (et sur Vercel).",
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
