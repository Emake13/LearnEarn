"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/** Consistent page title block with an optional back affordance. */
export function PageHeader({
  title,
  subtitle,
  backHref = "/",
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <div className="le-rise pt-5">
      <Link
        href={backHref}
        className="group mb-3 inline-flex items-center gap-1 text-[12px] font-semibold text-white/45 transition-colors duration-300 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Back
      </Link>
      <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.025em] text-white">
        {title}
      </h1>
      {subtitle && <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/45">{subtitle}</p>}
    </div>
  );
}
