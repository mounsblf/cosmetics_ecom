import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import {
  USER_COOKIE,
  USER_COOKIE_OPTIONS,
  createUserToken,
  verifyPassword,
} from "@/lib/userAuth";

/** POST /api/auth/login — vérifie les identifiants et ouvre la session. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-mail et mot de passe requis." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    // Message volontairement identique que l'email existe ou non
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "E-mail ou mot de passe incorrect." },
        { status: 401 },
      );
    }

    const res = NextResponse.json({
      ok: true,
      user: { id: String(user._id), name: user.name, email: user.email },
    });
    res.cookies.set(USER_COOKIE, createUserToken(String(user._id)), USER_COOKIE_OPTIONS);
    return res;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
