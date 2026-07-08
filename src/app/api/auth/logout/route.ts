import { NextResponse } from "next/server";
import { USER_COOKIE } from "@/lib/userAuth";

/** GET /api/auth/logout — ferme la session client et renvoie à l'accueil. */
export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.set(USER_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
