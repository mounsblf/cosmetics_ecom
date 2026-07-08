"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";

const fieldCls =
  "mt-1 w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-2.5 text-charcoal outline-none focus:border-olive";

/** Formulaire commun connexion / inscription. */
export function AuthForm({
  mode,
  next,
}: {
  mode: "login" | "register";
  next?: string;
}) {
  const router = useRouter();
  const { refresh } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const destination = next || "/compte";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegister ? { name, email, password } : { email, password },
          ),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      await refresh(); // met à jour l'en-tête
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  const switchHref = `${isRegister ? "/compte/connexion" : "/compte/inscription"}${
    next ? `?next=${encodeURIComponent(next)}` : ""
  }`;

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-charcoal/10 bg-white p-8"
        >
          <p className="eyebrow text-terracotta">
            {isRegister ? "Bienvenue" : "Heureux de vous revoir"}
          </p>
          <h1 className="mt-3 text-3xl text-charcoal">
            {isRegister ? "Créer un compte" : "Se connecter"}
          </h1>

          {isRegister && (
            <label className="mt-6 block">
              <span className="text-sm text-charcoal/70">Nom</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={fieldCls}
                required
              />
            </label>
          )}

          <label className="mt-4 block">
            <span className="text-sm text-charcoal/70">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={fieldCls}
              required
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm text-charcoal/70">
              Mot de passe{isRegister ? " (8 caractères minimum)" : ""}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              className={fieldCls}
              required
            />
          </label>

          {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-6 w-full"
            disabled={loading}
          >
            {loading
              ? "Un instant…"
              : isRegister
                ? "Créer mon compte"
                : "Se connecter"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-charcoal/60">
          {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <Link href={switchHref} className="text-olive underline underline-offset-4">
            {isRegister ? "Se connecter" : "S'inscrire"}
          </Link>
        </p>

        {next === "/panier" && (
          <p className="mt-2 text-center text-sm text-charcoal/50">
            ou{" "}
            <Link href="/panier" className="underline underline-offset-4">
              continuer en invité
            </Link>
          </p>
        )}
      </div>
    </Container>
  );
}
