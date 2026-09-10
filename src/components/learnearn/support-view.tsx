"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Headset,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { BANK_DETAILS } from "@/lib/learnearn-config";
import { PageHeader } from "./page-header";

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

      <section className="mt-5 flex flex-col gap-2.5">
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
