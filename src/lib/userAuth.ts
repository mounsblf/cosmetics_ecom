import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import { User } from "@/models/User";

/**
 * Sessions clients : cookie httpOnly contenant "<userId>.<expiration>.<signature>",
 * signé HMAC avec AUTH_SECRET. Même philosophie que la session admin,
 * mais avec un compte par client (mot de passe haché bcrypt).
 */

export const USER_COOKIE = "user_session";
const SESSION_DAYS = 30;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET manquant dans les variables d'environnement.");
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/* ---------- Mots de passe ---------- */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

/* ---------- Jetons de session ---------- */

export function createUserToken(userId: string): string {
  const exp = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

/** Retourne l'userId si le jeton est valide, sinon null. */
export function verifyUserToken(token: string | undefined): string | null {
  if (!token) return null;
  const [userId, exp, sig] = token.split(".");
  if (!userId || !exp || !sig) return null;
  if (Number(exp) < Date.now()) return null;
  try {
    if (!safeEqual(sig, sign(`${userId}.${exp}`))) return null;
  } catch {
    return null; // AUTH_SECRET absent → aucune session valide
  }
  return userId;
}

/** Options du cookie de session (partagées login/register). */
export const USER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

/* ---------- Utilisateur courant (côté serveur) ---------- */

/** Lit le cookie, vérifie la session et charge le client. Null si anonyme. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const userId = verifyUserToken(store.get(USER_COOKIE)?.value);
  if (!userId) return null;

  try {
    await connectToDatabase();
    const doc = await User.findById(userId).lean();
    if (!doc) return null;
    return { id: String(doc._id), name: doc.name, email: doc.email };
  } catch (error) {
    console.error("[getCurrentUser]", error);
    return null;
  }
}
