import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen px-6 py-6 text-slate-950 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm shadow-slate-200/70 backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-lg font-black text-white shadow-lg shadow-teal-600/20">
              P
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">PolicyPilot</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Policy AI Copilot</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-2 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/new" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950">
              새 정책서
            </Link>
            <Link href="/projects/pilot-001" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950">
              질문 답변
            </Link>
            <Link href="/documents/pilot-001" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950">
              결과 보기
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
