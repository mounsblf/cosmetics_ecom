"use client";

import { useRef } from "react";

/**
 * Carte 3D interactive : s'incline vers le pointeur (perspective CSS)
 * avec un léger reflet. Zéro dépendance — transform appliqué via ref
 * pour éviter tout re-render pendant le mouvement.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = inner.current;
    if (!el || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0 → 1
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * maxTilt * 2;
    const ry = (px - 0.5) * maxTilt * 2;
    el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.02)`;
    if (glare.current) {
      glare.current.style.opacity = "1";
      glare.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.28), transparent 55%)`;
    }
  }

  function handleLeave() {
    if (inner.current) inner.current.style.transform = "";
    if (glare.current) glare.current.style.opacity = "0";
  }

  return (
    <div
      style={{ perspective: "900px" }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
    >
      <div
        ref={inner}
        className="relative h-full w-full transition-transform duration-300 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        <div
          ref={glare}
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        />
      </div>
    </div>
  );
}
