"use client";

import { useRef } from "react";
import { ArchMotif } from "./ArchMotif";
import { ZelligeStar } from "./ZelligeStar";

/**
 * Scène décorative 3D du héro : couches en parallaxe suivant le pointeur,
 * étoile khatam en rotation 3D continue, arche et pastilles flottantes.
 * 100 % CSS/SVG — aucun moteur 3D à charger.
 */
export function Hero3D() {
  const layers = useRef<Array<HTMLDivElement | null>>([]);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    layers.current.forEach((el, i) => {
      if (!el) return;
      const depth = (i + 1) * 10; // plus la couche est haute, plus elle bouge
      el.style.transform = `translate3d(${(-dx * depth).toFixed(1)}px, ${(-dy * depth).toFixed(1)}px, 0)`;
    });
  }

  function handleLeave() {
    layers.current.forEach((el) => {
      if (el) el.style.transform = "";
    });
  }

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative hidden h-[420px] select-none md:block lg:h-[500px]"
      aria-hidden="true"
    >
      {/* Couche 1 — halo de fond */}
      <div
        ref={(el) => {
          layers.current[0] = el;
        }}
        className="absolute inset-0 transition-transform duration-200 ease-out"
      >
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta/15 blur-3xl" />
      </div>

      {/* Couche 2 — étoile khatam en rotation 3D (posée « au sol ») */}
      <div
        ref={(el) => {
          layers.current[1] = el;
        }}
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{ perspective: "700px" }}
      >
        <div
          className="absolute left-1/2 top-[62%] -ml-32 -mt-32 h-64 w-64"
          style={{ animation: "spin-3d 26s linear infinite" }}
        >
          <ZelligeStar className="h-full w-full text-terracotta/50" />
        </div>
      </div>

      {/* Couche 3 — grande arche flottante */}
      <div
        ref={(el) => {
          layers.current[2] = el;
        }}
        className="absolute inset-0 transition-transform duration-200 ease-out"
      >
        <div className="animate-float absolute left-1/2 top-1/2 h-72 -translate-x-1/2 -translate-y-[58%]">
          <ArchMotif className="h-full w-auto text-charcoal/70" />
        </div>
      </div>

      {/* Couche 4 — accents : petite étoile or + pastilles */}
      <div
        ref={(el) => {
          layers.current[3] = el;
        }}
        className="absolute inset-0 transition-transform duration-200 ease-out"
      >
        <div
          className="absolute right-[18%] top-[16%] h-10 w-10"
          style={{ animation: "spin-y 12s linear infinite" }}
        >
          <ZelligeStar className="h-full w-full text-gold" filled />
        </div>
        <span className="animate-float absolute left-[14%] top-[30%] h-3 w-3 rounded-full bg-olive/60 [animation-delay:1.2s]" />
        <span className="animate-float absolute bottom-[18%] right-[26%] h-2 w-2 rounded-full bg-terracotta/70 [animation-delay:2.1s]" />
        <span className="animate-float absolute left-[30%] bottom-[24%] h-2.5 w-2.5 rounded-full bg-gold/70 [animation-delay:0.6s]" />
      </div>
    </div>
  );
}
