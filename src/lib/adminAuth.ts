import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Authentification admin minimaliste :
 * - un mot de passe unique (ADMIN_PASSWORD) pour se connecter,
 * - un cookie de session signé HMAC avec date d'expiration.
 * Suffisant et simple pour un back-office mono-administrateur.
 */

export const ADMIN_COOKIE = "admin_session";
const SESSION_DAYS = 7;

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Vérifie le mot de passe saisi au login. */
export function checkPassword(password: string): boolean {
  const expected = secret();
  if (!expected) return false;
  return safeEqual(password, expected);
}

/** Crée un jeton de session : "<expiration>.<signature>". */
export function createSessionToken(): string {
  const exp = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return `${exp}.${sign(exp)}`;
}

/** Vérifie un jeton de session (signature + expiration). */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

/** Pour les routes API : la requête vient-elle d'un admin connecté ? */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
