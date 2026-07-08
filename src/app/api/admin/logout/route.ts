import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

/** Déconnexion : supprime le cookie puis renvoie vers la page de connexion. */
export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url));
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
