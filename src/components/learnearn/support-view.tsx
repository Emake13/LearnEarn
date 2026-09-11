"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Headset,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BANK_DETAILS, SUPPORT_LINKS } from "@/lib/learnearn-config";
import { PageHeader } from "./page-header";

type Network = {
  title: string;
  body: string;
  action: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
};

/** Official community and live-agent destinations. */
const NETWORKS: Network[] = [
  {
    title: "Telegram Channel",
    body: "Join our Official Telegram Channel for daily updates and claim alerts.",
    action: "Open Telegram",
    href: SUPPORT_LINKS.telegram,
    icon: Send,
    gradient: "from-[#38BDF8] via-[#22D3EE] to-[#0EA5E9]",
    glow: "rgba(34,211,238,0.5)",
  },
  {
    title: "WhatsApp Channel",
    body: "Follow our verified WhatsApp Channel to never miss a community event.",
    action: "Follow channel",
    href: SUPPORT_LINKS.whatsappChannel,
    icon: Users,
    gradient: "from-[#4ADE80] via-[#22C55E] to-[#16A34A]",
    glow: "rgba(74,222,128,0.45)",
  },
  {
    title: "Live Agent Support",
    body: "Need direct help with an account funding or withdrawal issue? Chat with an admin on WhatsApp.",
    action: `Chat with ${SUPPORT_LINKS.liveAgentNumber}`,
    href: SUPPORT_LINKS.liveAgent,
    icon: MessageCircle,
    gradient: "from-[#A78BFA] via-[#8B5CF6] to-[#4F46E5]",
    glow: "rgba(139,92,246,0.5)",
  },
];

const CHANNELS = [
  {
    label: "Live chat",
    sub: "Average reply under 5 minutes",
    icon: MessageCircle,
    href: "https://wa.me/2349018312737",
    tint: "text-[#4ADE80] border-[#4ADE80]/25 bg-[#4ADE80]/10",
  },
  {
    label: "Email us",
    sub: "support@learnearn.ng",
    icon: Mail,
    href: "mailto:support@learnearn.ng",
    tint: "text-[#A78BFA] border-[#8B5CF6]/28 bg-[#8B5CF6]/12",
  },
  {
    label: "Call the desk",
    sub: "Mon – Sat, 8am to 8pm",
    icon: Phone,
    href: "tel:+2349018312737",
    tint: "text-[#22D3EE] border-[#22D3EE]/25 bg-[#22D3EE]/10",
  },
];

const FAQS = [
  {
    q: "How long does a withdrawal take?",
    a: "Beginner accounts are paid within 24 hours. Pro accounts are paid instantly, usually inside a few minutes.",
  },
  {
    q: "My transfer is not showing in my balance.",
    a: `Funding by transfer is confirmed manually. Make sure you sent to ${BANK_DETAILS.accountName} — ${BANK_DETAILS.accountNumber} (${BANK_DETAILS.bankName}) and uploaded your receipt on the Payment page. Reviews finish within a few hours.`,
  },
  {
    q: "Why can I not use OPay for the transfer?",
    a: "Transfers from OPay are not reconciled automatically on our side and get delayed. Please use any other bank app for the transfer.",
  },
  {
    q: "Where do I get a Naira Code?",
    a: "Naira Codes are sold by our verified vendors. Once you buy one, enter it on the BUY Naira Code page and the value lands in your wallet immediately.",
  },
  {
    q: "Do I have to pay anything to withdraw?",
    a: "No. Withdrawing your balance is free and never requires a code, a fee or a transfer of any kind. If anyone asks you to pay to release a withdrawal, it is a scam — report it to us on live chat.",
  },
  {
    q: "Can I change my payout bank account?",
    a: "Yes. Reach out on live chat with your registered email and the new account details, and the desk will update it for you.",
  },
];

/** Support centre: contact channels + FAQ accordion. */
export function SupportView() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pb-4">
      <PageHeader title="Support" subtitle="We are one tap away, every day." />

      <div className="le-rise le-glass le-grain relative mt-5 overflow-hidden rounded-[26px] p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 h-44 w-44 rounded-full bg-[#22D3EE] opacity-25 blur-[60px]"
        />
        <div className="relative flex items-center gap-4">
          <span className="le-breathe grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#22D3EE]/28 bg-[#22D3EE]/12 text-[#22D3EE]">
            <Headset className="h-6 w-6" strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[16px] font-bold text-white">
              Need a hand?
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-white/50">
              Real people, no bots. Pick a channel below and we will sort it out.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-5 flex flex-col gap-3">
        {NETWORKS.map(({ title, body, action, href, icon: Icon, gradient, glow }, i) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group le-rise relative block rounded-[22px] p-px transition-transform duration-300 hover:-translate-y-1 active:scale-[0.985]"
            style={{ animationDelay: `${80 + i * 70}ms` }}
          >
            <span
              aria-hidden
              className={`absolute inset-0 rounded-[22px] bg-gradient-to-br ${gradient} opacity-55 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <span
              aria-hidden
              className="absolute -inset-1 rounded-[26px] opacity-0 blur-[18px] transition-opacity duration-300 group-hover:opacity-70"
              style={{ backgroundColor: glow }}
            />

            <span className="le-grain relative flex items-start gap-3.5 rounded-[21px] bg-[#101017] p-4">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon className="h-[19px] w-[19px] text-white" strokeWidth={2.1} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="font-display text-[14px] font-bold tracking-[-0.01em] text-white">
                    {title}
                  </span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 text-white/30 transition-colors duration-300 group-hover:text-white/70"
                    strokeWidth={2.2}
                  />
                </span>
                <span className="mt-1 block text-[11.5px] leading-relaxed text-white/45">
                  {body}
                </span>
                <span className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold text-white/75 transition-colors duration-300 group-hover:border-white/25 group-hover:text-white">
                  {action}
                </span>
              </span>
            </span>
          </a>
        ))}
      </section>

      <h2
        className="le-rise mt-7 mb-3 font-display text-[15px] font-bold text-white"
        style={{ animationDelay: "280ms" }}
      >
        Other ways to reach us
      </h2>

      <section className="flex flex-col gap-2.5">
        {CHANNELS.map(({ label, sub, icon: Icon, href, tint }, i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group le-rise le-panel flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-300 hover:bg-white/[0.07]"
            style={{ animationDelay: `${100 + i * 60}ms` }}
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${tint}`}>
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[13.5px] font-semibold text-white">
                {label}
              </p>
              <p className="truncate text-[11.5px] text-white/45">{sub}</p>
            </div>
          </a>
        ))}
      </section>

      <section className="le-rise mt-6" style={{ animationDelay: "280ms" }}>
        <h2 className="mb-3 font-display text-[15px] font-bold text-white">
          Frequently asked
        </h2>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.q} className="le-panel overflow-hidden rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors duration-300 hover:bg-white/[0.03]"
                >
                  <span className="flex-1 font-display text-[13px] font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-300 ${
                      open ? "rotate-180 text-[#A78BFA]" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-[12px] leading-relaxed text-white/50">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="le-rise mt-5 flex items-start gap-3 rounded-2xl border border-[#8B5CF6]/22 bg-[#8B5CF6]/[0.07] p-4" style={{ animationDelay: "340ms" }}>
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#A78BFA]" strokeWidth={2.1} />
        <p className="text-[11.5px] leading-relaxed text-white/55">
          LearnEarn staff will never ask for your password. Fund only the official
          account shown on the{" "}
          <Link href="/payment" className="font-semibold text-[#C4B5FD] underline underline-offset-2">
            Payment page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
