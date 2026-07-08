import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { connectToDatabase } from "@/lib/db";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin · Commandes" };

interface OrderRow {
  id: string;
  status: string;
  amountTotal: number;
  customerEmail: string;
  items: string;
  createdAt: string;
}

async function getOrders(): Promise<OrderRow[]> {
  try {
    await connectToDatabase();
    const docs = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
    return docs.map((o) => ({
      id: String(o._id),
      status: o.status ?? "pending",
      amountTotal: o.amountTotal,
      customerEmail: o.customerEmail || "—",
      items: (o.items ?? [])
        .map((i) => `${i.quantity}× ${i.name}`)
        .join(", "),
      createdAt: o.createdAt
        ? new Date(o.createdAt).toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "",
    }));
  } catch (error) {
    console.error("[admin/commandes]", error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <Container className="py-10">
      <h1 className="text-3xl text-charcoal">Commandes</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        {orders.length} commande{orders.length > 1 ? "s" : ""} (100 dernières)
      </p>

      {orders.length === 0 ? (
        <p className="mt-10 text-charcoal/60">Aucune commande pour l&apos;instant.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-charcoal/50">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Articles</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-charcoal/5 align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-charcoal/70">
                    {o.createdAt}
                  </td>
                  <td className="px-4 py-3 text-charcoal/80">{o.customerEmail}</td>
                  <td className="px-4 py-3 text-charcoal/70">{o.items}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-charcoal">
                    {formatPrice(o.amountTotal)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
