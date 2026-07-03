/**
 * Motif d'arche marocaine stylisé (trait fin) — touche culturelle discrète.
 * Réutilisé dans le hero et les visuels produits.
 * Sera enrichi plus tard par de vrais motifs (zellige, etc.).
 */
export function ArchMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 128 V60 C10 32 28 12 50 12 C72 12 90 32 90 60 V128"
        stroke="currentColor"
        strokeWidth={1}
      />
      <path
        d="M22 128 V60 C22 40 34 26 50 26 C66 26 78 40 78 60 V128"
        stroke="currentColor"
        strokeWidth={0.75}
        opacity={0.5}
      />
    </svg>
  );
}
