import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ArchMotif } from "@/components/decor/ArchMotif";
import { ClearCart } from "@/components/cart/ClearCart";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Merci pour votre commande",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let email = "";
  let amount: number | null = null;
  try {
    if (session_id) {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? "";
      amount =
        session.amount_total != null ? session.amount_total / 100 : null;
    }
  } catch {
    // session introuvable → on affiche quand même un remerciement
  }

  return (
    <Container className="py-24 text-center">
      {/* Vide le panier côté client */}
      <ClearCart />

      <ArchMotif className="mx-auto h-16 w-auto text-terracotta/60" />
      <p className="eyebrow mt-8 text-olive">Commande confirmée</p>
      <h1 className="mt-4 text-4xl text-charcoal md:text-5xl">
        Merci pour votre commande
      </h1>
      <p className="mx-auto mt-5 max-w-md text-charcoal/70">
        Votre paiement a bien été reçu.
        {email && (
          <>
            {" "}
            Un e-mail de confirmation sera envoyé à{" "}
            <span className="text-charcoal">{email}</span>.
          </>
        )}
      </p>

      {amount != null && (
        <p className="mt-6 text-lg text-charcoal">
          Total réglé : <strong>{formatPrice(amount)}</strong>
        </p>
      )}

      <div className="mt-10">
        <ButtonLink href="/produits" size="lg">
          Continuer mes achats
        </ButtonLink>
      </div>
    </Container>
  );
}
