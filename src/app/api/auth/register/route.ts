import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import {
  USER_COOKIE,
  USER_COOKIE_OPTIONS,
  createUserToken,
  hashPassword,
} from "@/lib/userAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/auth/register — crée un compte et connecte immédiatement. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    password?: string;
  };

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Indiquez votre nom." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 8 caractères." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    if (await User.exists({ email })) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet e-mail. Connectez-vous." },
        { status: 409 },
      );
    }

    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "customer",
    });

    const res = NextResponse.json({
      ok: true,
      user: { id: String(user._id), name: user.name, email: user.email },
    });
    res.cookies.set(USER_COOKIE, createUserToken(String(user._id)), USER_COOKIE_OPTIONS);
    return res;
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
