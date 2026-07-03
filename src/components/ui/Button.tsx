import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "gold";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/40 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // Action principale : olive profond (élégant, mat)
  primary: "bg-olive text-cream hover:bg-olive/90",
  // Secondaire : contour fin charbon
  secondary:
    "border border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal/[0.03]",
  // Or « avec parcimonie » : réservé aux actions à forte valeur (panier, payer)
  gold: "bg-gold text-charcoal hover:bg-gold/90",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-[0.95rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

/** Bouton rendu comme un lien Next (navigation interne ou externe). */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}

/** Bouton d'action classique (<button>). */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
