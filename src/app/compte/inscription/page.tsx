import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/lib/userAuth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Créer un compte" };

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getCurrentUser()) redirect("/compte");
  const { next } = await searchParams;
  return <AuthForm mode="register" next={next} />;
}
