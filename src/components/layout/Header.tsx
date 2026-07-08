"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Boutique", href: "/produits" },
  { label: "Coffrets", href: "/coffrets" },
  { label: "La Maison", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

/** Logo textuel de la marque (placeholder à remplacer par le vrai logo). */
function Wordmark() {
  return (
    <Link href="/" className="group flex items-baseline gap-1">
      <span className="font-display text-2xl tracking-tight text-charcoal">
        Nūr
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-gold transition-transform group-hover:scale-125" />
    </Link>
  );
}

/** Icône panier (trait fin, cohérente minimalisme). */
function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

/** Icône compte client (trait fin). */
function AccountIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { totalItems, loaded } = useCart();
  const { user, loaded: userLoaded } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-20">
          <Wordmark />

          {/* Navigation — desktop */}
          <nav className="hidden md:flex md:items-center md:gap-9">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide text-charcoal/80 transition-colors hover:text-charcoal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href={user ? "/compte" : "/compte/connexion"}
              aria-label={user ? `Mon compte (${user.name})` : "Se connecter"}
              className="relative text-charcoal transition-colors hover:text-olive"
            >
              <AccountIcon className="h-6 w-6" />
              {userLoaded && user && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-cream bg-olive" />
              )}
            </Link>
            <Link
              href="/panier"
              aria-label={`Panier (${totalItems} article${totalItems > 1 ? "s" : ""})`}
              className="relative text-charcoal transition-colors hover:text-olive"
            >
              <CartIcon className="h-6 w-6" />
              {loaded && totalItems > 0 && (
                <span
                  key={totalItems} // relance l'animation « pop » à chaque changement
                  className="animate-pop absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-olive px-1 text-[0.65rem] font-medium text-cream"
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Bouton menu — mobile */}
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center md:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-5 bg-charcoal transition-transform",
                    open && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-5 bg-charcoal transition-transform",
                    open && "-translate-y-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {/* Panneau mobile */}
      {open && (
        <nav className="border-t border-charcoal/10 bg-cream md:hidden">
          <Container>
            <ul className="flex flex-col py-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-sm tracking-wide text-charcoal/80 hover:text-charcoal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
