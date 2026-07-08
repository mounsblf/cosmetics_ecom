/**
 * Étoile à 8 branches (khatam) — motif fondateur du zellige marocain,
 * tracée en deux carrés superposés (rotation 45°), style trait fin contemporain.
 */
export function ZelligeStar({
  className,
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.4}
        fill={filled ? "currentColor" : "none"}
      >
        <rect x="22" y="22" width="56" height="56" />
        <rect
          x="22"
          y="22"
          width="56"
          height="56"
          transform="rotate(45 50 50)"
        />
      </g>
      {!filled && (
        <circle
          cx="50"
          cy="50"
          r="10"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      )}
    </svg>
  );
}

/** Frise horizontale de petites étoiles — séparateur de sections. */
export function ZelligeBand({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-6 ${className ?? ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <ZelligeStar
          key={i}
          className={`h-4 w-4 ${i === 3 ? "text-gold" : "text-terracotta/40"}`}
          filled={i === 3}
        />
      ))}
    </div>
  );
}
