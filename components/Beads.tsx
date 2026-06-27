import type { CSSProperties } from "react";

const PALETTE = ["#FF4D8B", "#B8A4ED", "#FFB084", "#E8B94A", "#A4D4C5", "#FF6B5A"];

export function HeroStrand() {
  const N = 16;
  const R = 42;
  return (
    <div className="strand" aria-hidden>
      {Array.from({ length: N }, (_, i) => {
        const ang = (i / N) * Math.PI * 2;
        const c = PALETTE[i % PALETTE.length];
        const style: CSSProperties = {
          background: `radial-gradient(circle at 35% 30%,#fff,${c} 75%)`,
          transform: `translate(-50%,-50%) rotate(${ang}rad) translate(${R}%) rotate(${-ang}rad)`,
        };
        return <span key={i} className="bead" style={style} />;
      })}
    </div>
  );
}

export function MiniStrand({ seed = 0 }: { seed?: number }) {
  return (
    <div className="mini-strand">
      {Array.from({ length: 7 }, (_, i) => {
        const c = PALETTE[(i + seed) % PALETTE.length];
        const style: CSSProperties = {
          position: "absolute",
          top: "50%",
          left: `${(i / 6) * 100}%`,
          width: "15%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          background: `radial-gradient(circle at 35% 30%,#fff,${c} 75%)`,
          boxShadow:
            "inset -2px -3px 6px rgba(0,0,0,.18), inset 2px 2px 5px rgba(255,255,255,.5)",
        };
        return <span key={i} style={style} />;
      })}
    </div>
  );
}
