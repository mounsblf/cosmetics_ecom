import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userAuth";

/** GET /api/auth/me — l'utilisateur connecté (ou null), pour l'UI client. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
