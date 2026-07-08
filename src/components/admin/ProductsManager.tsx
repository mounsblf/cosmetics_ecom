"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface AdminProduct {
  id: string;
  type: "unit" | "box";
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  boxSize: string;
}

const inputCls =
  "w-24 rounded-lg border border-charcoal/20 bg-cream px-2 py-1 text-sm text-charcoal outline-none focus:border-olive";

/** Ligne éditable d'un article (prix, stock, visibilité). */
function ProductRow({ product }: { product: AdminProduct }) {
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [active, setActive] = useState(product.isActive);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(patch: Record<string, unknown>) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      alert(`Échec de la mise à jour de « ${product.name} ».`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr className={cn("border-b border-charcoal/5", !active && "opacity-50")}>
      <td className="px-4 py-3">
        <span className="font-medium text-charcoal">{product.name}</span>
        <span className="ml-2 text-xs text-charcoal/40">
          {product.type === "box" ? `Coffret ${product.boxSize}` : product.category}
        </span>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          step="0.5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={() => {
            const v = Number(price);
            if (!Number.isNaN(v) && v !== product.price) save({ price: v });
          }}
          className={inputCls}
        />{" "}
        <span className="text-xs text-charcoal/40">€</span>
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          min={0}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          onBlur={() => {
            const v = Number(stock);
            if (!Number.isNaN(v) && v !== product.stock) save({ stock: v });
          }}
          className={inputCls}
        />
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => {
            setActive(!active);
            save({ isActive: !active });
          }}
          className={cn(
            "rounded-full border px-3 py-1 text-xs transition-colors",
            active
              ? "border-olive/40 text-olive"
              : "border-charcoal/20 text-charcoal/50",
          )}
        >
          {active ? "Visible" : "Masqué"}
        </button>
      </td>
      <td className="w-16 px-2 py-3 text-xs text-charcoal/40">
        {saving ? "…" : saved ? "✓" : ""}
      </td>
    </tr>
  );
}

/** Formulaire de création (produit à l'unité ou coffret pré-composé). */
function CreateForm({
  units,
  onDone,
}: {
  units: AdminProduct[];
  onDone: () => void;
}) {
  const [type, setType] = useState<"unit" | "box">("unit");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Visage");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [ingredients, setIngredients] = useState("");
  const [boxSize, setBoxSize] = useState<"Petit" | "Moyen" | "Grand">("Petit");
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fieldCls =
    "w-full rounded-xl border border-charcoal/20 bg-cream px-3 py-2 text-sm text-charcoal outline-none focus:border-olive";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          category,
          description,
          price: Number(price),
          stock: Number(stock),
          ...(type === "unit"
            ? {
                ingredients: ingredients
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }
            : {
                boxSize,
                contents: Object.entries(selected).map(([id, quantity]) => ({
                  id,
                  quantity,
                })),
              }),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Création impossible.");
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création impossible.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-6"
    >
      <div className="flex gap-2">
        {(["unit", "box"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm",
              type === t
                ? "border-charcoal bg-charcoal text-cream"
                : "border-charcoal/20 text-charcoal/60",
            )}
          >
            {t === "unit" ? "Produit à l'unité" : "Coffret"}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs text-charcoal/60">Nom *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={fieldCls} required />
        </label>

        {type === "unit" ? (
          <label className="block">
            <span className="text-xs text-charcoal/60">Catégorie</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldCls}>
              <option>Visage</option>
              <option>Corps</option>
              <option>Cheveux</option>
            </select>
          </label>
        ) : (
          <label className="block">
            <span className="text-xs text-charcoal/60">Taille du coffret</span>
            <select
              value={boxSize}
              onChange={(e) => setBoxSize(e.target.value as typeof boxSize)}
              className={fieldCls}
            >
              <option>Petit</option>
              <option>Moyen</option>
              <option>Grand</option>
            </select>
          </label>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-charcoal/60">Prix (€) *</span>
            <input
              type="number" min={0} step="0.5" value={price}
              onChange={(e) => setPrice(e.target.value)} className={fieldCls} required
            />
          </label>
          <label className="block">
            <span className="text-xs text-charcoal/60">Stock</span>
            <input
              type="number" min={0} value={stock}
              onChange={(e) => setStock(e.target.value)} className={fieldCls}
            />
          </label>
        </div>

        <label className="block sm:col-span-2">
          <span className="text-xs text-charcoal/60">Description</span>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            rows={2} className={fieldCls}
          />
        </label>

        {type === "unit" ? (
          <label className="block sm:col-span-2">
            <span className="text-xs text-charcoal/60">
              Ingrédients (séparés par des virgules)
            </span>
            <input
              value={ingredients} onChange={(e) => setIngredients(e.target.value)}
              placeholder="Argan, Eau de rose…" className={fieldCls}
            />
          </label>
        ) : (
          <div className="sm:col-span-2">
            <span className="text-xs text-charcoal/60">
              Produits inclus dans le coffret *
            </span>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {units.map((u) => {
                const checked = selected[u.id] != null;
                return (
                  <li key={u.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        setSelected((prev) => {
                          const next = { ...prev };
                          if (e.target.checked) next[u.id] = 1;
                          else delete next[u.id];
                          return next;
                        });
                      }}
                    />
                    <span className="flex-1 text-charcoal/80">{u.name}</span>
                    {checked && (
                      <input
                        type="number" min={1} value={selected[u.id]}
                        onChange={(e) =>
                          setSelected((prev) => ({
                            ...prev,
                            [u.id]: Math.max(1, Number(e.target.value) || 1),
                          }))
                        }
                        className="w-14 rounded-lg border border-charcoal/20 bg-cream px-2 py-0.5 text-sm"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}

      <Button type="submit" variant="primary" size="md" className="mt-5" disabled={saving}>
        {saving ? "Création…" : "Créer l'article"}
      </Button>
    </form>
  );
}

export function ProductsManager({ initial }: { initial: AdminProduct[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const units = initial.filter((p) => p.type === "unit");

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal/60">
          {initial.length} article{initial.length > 1 ? "s" : ""}
        </p>
        <Button
          variant={showForm ? "secondary" : "primary"}
          size="md"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Fermer" : "+ Nouvel article"}
        </Button>
      </div>

      {showForm && (
        <CreateForm
          units={units}
          onDone={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wider text-charcoal/50">
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Visibilité</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {initial.map((p) => (
              <ProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
