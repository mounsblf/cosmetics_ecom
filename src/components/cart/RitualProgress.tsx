"use client";

import type { CartItem } from "@/context/CartContext";
import { ZelligeStar } from "@/components/decor/ZelligeStar";
import { cn } from "@/lib/utils";

const UNIVERSES = ["Visage", "Corps", "Cheveux"] as const;

/**
 * Progression « Complétez votre rituel » : un univers (Visage/Corps/Cheveux)
 * est validé s'il est présent dans le panier. Un coffret valide tout le rituel.
 */
export function RitualProgress({ items }: { items: CartItem[] }) {
  const hasBox = items.some((i) => i.type === "box");
  const covered = new Set(
    hasBox
      ? UNIVERSES
      : items
          .map((i) => i.category)
          .filter((c): c is (typeof UNIVERSES)[number] =>
            UNIVERSES.includes(c as (typeof UNIVERSES)[number]),
          ),
  );
  const count = covered.size;
  const complete = count === UNIVERSES.length;

  return (
    <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-charcoal">
          {complete ? "Rituel complet !" : "Complétez votre rituel"}
        </h3>
        <span
          className={cn(
            "text-xs font-medium",
            complete ? "text-gold" : "text-charcoal/50",
          )}
        >
          {count}/{UNIVERSES.length}
        </span>
      </div>

      {/* Barre de progression */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-charcoal/10">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            complete
              ? "bg-gradient-to-r from-terracotta to-gold"
              : "bg-olive",
          )}
          style={{ width: `${(count / UNIVERSES.length) * 100}%` }}
        />
      </div>

      {/* Univers */}
      <ul className="mt-4 flex gap-2">
        {UNIVERSES.map((u) => {
          const done = covered.has(u);
          return (
            <li
              key={u}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-xs transition-colors",
                done
                  ? "border-olive/40 bg-olive/10 text-olive"
                  : "border-charcoal/15 text-charcoal/40",
              )}
            >
              {done ? "✓" : "○"} {u}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 flex items-center gap-2 text-xs text-charcoal/55">
        {complete ? (
          <>
            <ZelligeStar className="h-4 w-4 animate-pop text-gold" filled />
            Votre routine couvre les trois univers. Belle harmonie !
          </>
        ) : (
          <>Un coffret complète le rituel d&apos;un coup. ✨</>
        )}
      </p>
    </div>
  );
}
