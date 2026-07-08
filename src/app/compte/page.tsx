import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/userAuth";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Mon compte" };

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  paid: { label: "Payée", cls: "border-olive/40 text-olive" },
  shipped: { label: "Expédiée", cls: "border-gold/50 text-[#a9852a]" },
  cancelled: { label: "Annulée", cls: "border-terracotta/50 text-terracotta" },
};

interface OrderView {
  id: string;
  date: string;
  items: string;
  total: number;
  status: string;
}

async function getOrders(userId: string, email: string): Promise<OrderView[]> {
  try {
    await connectToDatabase();
    // Commandes liées au compte + commandes invité passées avec le même e-mail
    const docs = await Order.find({
      status: { $ne: "pending" },
      $or: [{ user: userId }, { customerEmail: email }],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return docs.map((o) => ({
      id: String(o._id).slice(-8).toUpperCase(),
      date: o.createdAt
        ? new Date(o.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
      items: (o.items ?? []).map((i) => `${i.quantity}× ${i.name}`).join(", "),
      total: o.amountTotal,
      status: o.status ?? "paid",
    }));
  } catch (error) {
    console.error("[/compte]", error);
    return [];
  }
}

export default async function ComptePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/compte/connexion");

  const orders = await getOrders(user.id, user.email);

  return (
    <Container className="py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-terracotta">Mon compte</p>
          <h1 className="mt-3 text-4xl text-charcoal md:text-5xl">
            Bonjour, {user.name}
          </h1>
          <p className="mt-2 text-charcoal/60">{user.email}</p>
        </div>
        <a
          href="/api/auth/logout"
          className="text-sm text-charcoal/50 underline underline-offset-4 hover:text-terracotta"
        >
          Se déconnecter
        </a>
      </div>

      <h2 className="mt-14 text-2xl text-charcoal">Mes commandes</h2>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-8 text-center">
          <p className="text-charcoal/60">
            Vous n&apos;avez pas encore passé de commande.
          </p>
          <div className="mt-5">
            <ButtonLink href="/produits">Découvrir la boutique</ButtonLink>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => {
            const status = STATUS_LABELS[o.status] ?? STATUS_LABELS.paid;
            return (
              <li
                key={o.id}
                className="rounded-2xl border border-charcoal/10 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-charcoal">
                      Commande {o.id}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-0.5 text-xs",
                        status.cls,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <span className="text-sm text-charcoal/50">{o.date}</span>
                </div>
                <p className="mt-3 text-sm text-charcoal/70">{o.items}</p>
                <p className="mt-2 text-sm font-medium text-charcoal">
                  {formatPrice(o.total)}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-10 text-sm text-charcoal/50">
        Une question sur une commande ?{" "}
        <Link href="/contact" className="text-olive underline underline-offset-4">
          Contactez-nous
        </Link>
        .
      </p>
    </Container>
  );
}
