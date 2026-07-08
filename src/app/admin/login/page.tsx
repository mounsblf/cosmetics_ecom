"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Connexion impossible.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
      setLoading(false);
    }
  }

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-charcoal/10 bg-white p-8"
      >
        <h1 className="text-2xl text-charcoal">Espace administrateur</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Entrez le mot de passe pour accéder à la gestion de la boutique.
        </p>

        <label className="mt-6 block">
          <span className="text-sm text-charcoal/70">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="mt-1 w-full rounded-xl border border-charcoal/20 bg-cream px-4 py-2.5 text-charcoal outline-none focus:border-olive"
          />
        </label>

        {error && <p className="mt-3 text-sm text-terracotta">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="mt-6 w-full"
          disabled={loading || !password}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </Container>
  );
}
