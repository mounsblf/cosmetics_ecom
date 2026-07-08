import Link from "next/link";
import { Container } from "@/components/ui/Container";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Tous les produits", href: "/produits" },
      { label: "Coffrets", href: "/coffrets" },
      { label: "Nouveautés", href: "/produits" },
    ],
  },
  {
    title: "La Maison",
    links: [
      { label: "Notre histoire", href: "/a-propos" },
      { label: "Nos ingrédients", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Livraison & retours", href: "/livraison" },
      { label: "CGV", href: "/cgv" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-olive text-cream">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl">Nūr</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Cosmétiques naturels d&apos;inspiration marocaine. Argan, ghassoul
              et plantes, pour des soins sensoriels et authentiques.
            </p>
          </div>

          {/* Colonnes de liens */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow font-sans text-cream/60">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/85 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nūr. Tous droits réservés.</p>
          <p>Fait avec soin au Maroc.</p>
        </div>
      </Container>
    </footer>
  );
}
