/**
 * Ambient neon mesh that sits behind the whole app.
 * Purely decorative — fixed, non-interactive, and pointer-events-none.
 */
export function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Deep violet bloom behind the wallet card */}
      <div className="le-drift absolute -top-32 -left-20 h-[22rem] w-[22rem] rounded-full bg-[#7C3AED] opacity-[0.28] blur-[110px]" />
      {/* Cyan counter-accent, top right */}
      <div
        className="le-drift absolute -top-16 -right-24 h-72 w-72 rounded-full bg-[#22D3EE] opacity-[0.16] blur-[120px]"
        style={{ animationDelay: "-7s" }}
      />
      {/* Magenta-violet warmth in the mid section */}
      <div
        className="le-drift absolute top-[38%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#A855F7] opacity-[0.14] blur-[130px]"
        style={{ animationDelay: "-13s" }}
      />
      {/* Cool floor glow under the bottom navigation */}
      <div
        className="le-drift absolute -bottom-28 left-1/2 h-72 w-[26rem] -translate-x-1/2 rounded-full bg-[#4F46E5] opacity-[0.18] blur-[120px]"
        style={{ animationDelay: "-4s" }}
      />
      {/* Subtle vignette so edges stay inky */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_35%,rgba(11,11,15,0.85)_100%)]" />
    </div>
  );
}
