"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payée" },
  { value: "shipped", label: "Expédiée" },
  { value: "cancelled", label: "Annulée" },
];

const COLORS: Record<string, string> = {
  pending: "border-charcoal/20 text-charcoal/60",
  paid: "border-olive/40 text-olive",
  shipped: "border-gold/50 text-[#a9852a]",
  cancelled: "border-terracotta/50 text-terracotta",
};

/** Sélecteur de statut d'une commande (PATCH immédiat). */
export function OrderStatusSelect({
  orderId,
  status: initial,
}: {
  orderId: string;
  status: string;
}) {
  const [status, setStatus] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    const previous = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setStatus(previous); // rollback si échec
      alert("Impossible de mettre à jour le statut.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className={cn(
        "rounded-full border bg-transparent px-3 py-1 text-xs outline-none",
        COLORS[status] ?? COLORS.pending,
        saving && "opacity-50",
      )}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
