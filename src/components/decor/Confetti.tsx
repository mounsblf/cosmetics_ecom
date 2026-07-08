"use client";

import { useEffect, useState } from "react";

const COLORS = ["#d6a284", "#3b4436", "#d4af37", "#b8865f", "#e8d5a3"];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  round: boolean;
}

/** Pluie de confettis aux couleurs de la marque (célébration de commande). */
export function Confetti({ count = 36 }: { count?: number }) {
  // Généré au montage (côté client) pour éviter tout écart d'hydratation
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 2.4,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        round: Math.random() > 0.5,
      })),
    );
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}
