"use client";

import { useEffect, useRef, useState } from "react";
import { PartyPopper, X } from "lucide-react";
import { CELEBRATION_DURATION_MS, formatNaira } from "@/lib/learnearn-config";

const PALETTE = [
  "#A78BFA",
  "#8B5CF6",
  "#22D3EE",
  "#F5B301",
  "#FDE68A",
  "#4F46E5",
  "#FFFFFF",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spin: number;
  rotation: number;
  color: string;
  /** Flowers are drawn as five petals, confetti as a rounded ribbon. */
  kind: "confetti" | "flower";
  sway: number;
  swaySpeed: number;
};

/** Seeds one particle somewhere above the top edge. */
function makeParticle(width: number, height: number, initial: boolean): Particle {
  const kind: Particle["kind"] = Math.random() < 0.38 ? "flower" : "confetti";
  return {
    x: Math.random() * width,
    y: initial ? Math.random() * height : -20 - Math.random() * height * 0.5,
    vx: (Math.random() - 0.5) * 0.5,
    vy: 1.1 + Math.random() * 2.1,
    size: kind === "flower" ? 7 + Math.random() * 7 : 5 + Math.random() * 7,
    spin: (Math.random() - 0.5) * 0.13,
    rotation: Math.random() * Math.PI * 2,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    kind,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.012 + Math.random() * 0.028,
  };
}

/** Draws a soft five-petal flower centred on the current transform origin. */
function drawFlower(ctx: CanvasRenderingContext2D, size: number) {
  const petal = size * 0.62;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(0, -petal, petal * 0.52, petal, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.rotate((Math.PI * 2) / 5);
  }
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.24, 0, Math.PI * 2);
  ctx.fillStyle = "#FDE68A";
  ctx.fill();
}

/**
 * Full-screen celebration shown right after a successful daily claim.
 * Confetti and flowers rain for exactly one minute, then settle; the overlay
 * itself stays until the user dismisses it.
 */
export function CelebrationOverlay({
  amount,
  onClose,
}: {
  amount: number;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(
    Math.round(CELEBRATION_DURATION_MS / 1000)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("[CelebrationOverlay] 2d canvas context unavailable");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const target = reduced ? 40 : Math.min(200, Math.round(width / 3.2));
    const particles: Particle[] = Array.from({ length: target }, () =>
      makeParticle(width, height, true)
    );

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const raining = elapsed < CELEBRATION_DURATION_MS;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * 0.9;
        p.y += p.vy;
        p.rotation += p.spin;

        if (p.y - p.size > height) {
          // Keep the density constant while the minute is still running.
          if (raining) Object.assign(p, makeParticle(width, height, false));
          else p.y = height + p.size * 4;
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.kind === "flower") {
          ctx.globalAlpha = 0.92;
          drawFlower(ctx, p.size);
        } else {
          ctx.globalAlpha = 0.95;
          ctx.beginPath();
          ctx.roundRect(-p.size / 2, -p.size / 4, p.size, p.size / 2, p.size / 4);
          ctx.fill();
        }
        ctx.restore();
      }

      const settled = !raining && particles.every((p) => p.y - p.size > height);
      if (!settled) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const countdown = window.setInterval(() => {
      const left = Math.max(
        0,
        Math.round((CELEBRATION_DURATION_MS - (performance.now() - start)) / 1000)
      );
      setSecondsLeft(left);
      if (left === 0) window.clearInterval(countdown);
    }, 1000);

    console.log("[CelebrationOverlay] raining", target, "particles for 60s");

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(countdown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reward claimed"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0B0F]/85 px-6 backdrop-blur-xl"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Ambient bloom behind the message card */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="le-drift absolute top-1/4 left-1/4 h-56 w-56 rounded-full bg-[#7C3AED] opacity-40 blur-[80px]" />
        <div
          className="le-drift absolute right-1/4 bottom-1/3 h-48 w-48 rounded-full bg-[#22D3EE] opacity-25 blur-[80px]"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="le-rise le-glass le-grain relative w-full max-w-[330px] overflow-hidden rounded-[30px] p-7 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close celebration"
          className="absolute top-3.5 right-3.5 grid h-8 w-8 place-items-center rounded-full text-white/45 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-90"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <span className="le-breathe mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#FCD34D] to-[#F0A500] shadow-[0_16px_40px_-14px_rgba(245,179,1,1)]">
          <PartyPopper className="h-7 w-7 text-[#4A2C02]" strokeWidth={2.1} />
        </span>

        <h2 className="mt-5 font-display text-[21px] leading-tight font-extrabold tracking-[-0.025em] text-white">
          Reward claimed!
        </h2>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/50">
          Your daily reward has landed in your wallet.
        </p>

        <p className="le-tnum mt-4 font-display text-[30px] leading-none font-extrabold tracking-[-0.03em] text-[#4ADE80] [text-shadow:0_2px_26px_rgba(74,222,128,0.35)]">
          +{formatNaira(amount)}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="group relative mt-6 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-3.5 shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition-all duration-300 hover:brightness-110 active:scale-[0.975]"
        >
          <span
            aria-hidden
            className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />
          <span className="relative font-display text-[15px] font-bold text-white">
            Continue
          </span>
        </button>

        <p className="le-tnum mt-3 text-[10.5px] font-medium tracking-[0.04em] text-white/30">
          {secondsLeft > 0
            ? `Celebrating for ${secondsLeft}s`
            : "Come back in 24 hours for the next one"}
        </p>
      </div>
    </div>
  );
}
