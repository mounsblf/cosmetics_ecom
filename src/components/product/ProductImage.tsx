import { ArchMotif } from "@/components/decor/ArchMotif";
import { cn } from "@/lib/utils";

// Teintes douces (charte) choisies de façon déterministe selon le slug,
// pour varier les visuels tant qu'il n'y a pas de vraies photos produits.
const TINTS = [
  "bg-terracotta/15 text-terracotta",
  "bg-olive/12 text-olive",
  "bg-gold/15 text-[#a9852a]",
];

function tintFor(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return TINTS[sum % TINTS.length];
}

/**
 * Visuel d'un article. Affiche la photo si disponible,
 * sinon un placeholder teinté avec le motif d'arche.
 */
export function ProductImage({
  src,
  alt,
  seed,
  className,
}: {
  src?: string;
  alt: string;
  seed: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        tintFor(seed),
        className,
      )}
    >
      <ArchMotif className="h-3/5 w-auto opacity-40" />
    </div>
  );
}
