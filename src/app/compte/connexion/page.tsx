import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/userAuth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Connexion" };

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Déjà connecté → direction le compte
  if (await getCurrentUser()) redirect("/compte");
  const { next } = await searchParams;
  return <AuthForm mode="login" next={next} />;
}
