import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-teal-600 text-white shadow-lg shadow-teal-700/20 hover:bg-teal-700"
      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";

  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition ${styles}`}>
      {children}
    </Link>
  );
}
