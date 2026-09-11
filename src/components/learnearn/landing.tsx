import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { AmbientGlow } from "./ambient-glow";
import { Logo } from "./logo";

const HIGHLIGHTS = [
  { icon: BookOpen, title: "Learn", copy: "Short lessons and quizzes built for your phone." },
  { icon: Wallet, title: "Earn", copy: "Every completed task pays real Naira into your wallet." },
  { icon: ShieldCheck, title: "Grow", copy: "Upgrade your tier for higher limits and instant payouts." },
];

/**
 * Signed-out entry screen. Sends visitors into the register / login flow.
 */
export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0B0F] text-white">
      <AmbientGlow />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-10 pb-10">
        <div className="le-rise flex justify-center">
          <Logo />
        </div>

        <div className="le-rise mt-14" style={{ animationDelay: "80ms" }}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/12 px-3 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-[#C4B5FD] uppercase">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} />
            Learn • Earn • Grow
          </span>

          <h1 className="mt-5 font-display text-[38px] leading-[1.08] font-extrabold tracking-[-0.035em] text-white">
            Turn what you
            <br />
            learn into
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#22D3EE] bg-clip-text text-transparent">
              {" "}
              earnings
            </span>
            .
          </h1>

          <p className="mt-4 text-[14px] leading-relaxed text-white/50">
            Finish bite-sized lessons, quizzes and sponsored tasks. Watch your
            Naira balance grow, then withdraw straight to your bank.
          </p>
        </div>

        <div className="le-rise mt-9 flex flex-col gap-3" style={{ animationDelay: "160ms" }}>
          {HIGHLIGHTS.map(({ icon: Icon, title, copy }, i) => (
            <div
              key={title}
              className="le-panel flex items-center gap-3.5 rounded-2xl p-3.5"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#6D28D9] shadow-[0_10px_22px_-12px_rgba(139,92,246,1)]">
                <Icon className="h-[18px] w-[18px] text-white" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[13.5px] font-bold text-white">{title}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-white/45">{copy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="le-rise mt-auto pt-10" style={{ animationDelay: "260ms" }}>
          <Link
            href="/register"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C4DFF] to-[#4F46E5] py-4 shadow-[0_16px_40px_-14px_rgba(124,77,255,0.95)] transition-all duration-300 hover:brightness-110 active:scale-[0.975]"
          >
            <span
              aria-hidden
              className="le-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <span className="relative font-display text-[15.5px] font-bold text-white">
              Create your account
            </span>
            <ArrowRight className="relative h-[18px] w-[18px] text-white transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <p className="mt-4 text-center text-[12.5px] text-white/45">
            Already with us?{" "}
            <Link
              href="/login"
              className="font-bold text-[#A78BFA] transition-colors duration-300 hover:text-[#C4B5FD]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
