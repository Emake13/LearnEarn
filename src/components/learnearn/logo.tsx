import { GraduationCap } from "lucide-react";

/**
 * LearnEarn wordmark: glowing cap badge + two-tone logotype + tracked-out subtitle.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9] shadow-[0_0_22px_-4px_rgba(139,92,246,0.9)]">
        <span className="le-breathe absolute inset-0 rounded-full bg-[#8B5CF6] blur-[10px]" />
        <GraduationCap className="relative h-[18px] w-[18px] text-white" strokeWidth={2.2} />
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] font-extrabold tracking-[-0.02em] text-white">
          Learn<span className="text-[#A78BFA]">Earn</span>
        </span>
        {!compact && (
          <span className="mt-[3px] text-[7.5px] font-semibold uppercase leading-none tracking-[0.28em] text-white/45">
            Learn • Earn • Grow
          </span>
        )}
      </span>
    </div>
  );
}
