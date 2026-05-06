import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeader } from "@/components/SectionHeader";

const guidance = [
  "정책 대상 기능의 목적과 사용자 흐름",
  "처리되는 데이터 종류와 외부 연동 여부",
  "출시 일정, 담당 부서, 우려되는 리스크",
];

export default function NewPolicyPage() {
  return (
    <AppShell>
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-lg shadow-slate-200/70">
          <SectionHeader
            eyebrow="New Policy"
            title="새 정책서 생성"
            description="아래 정보는 mock 질문과 정책서 초안을 만드는 데 사용되는 프로토타입 입력값입니다."
          />
          <div className="mt-8 space-y-4">
            {guidance.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                {item}
              </div>
            ))}
          </div>
        </aside>
        <form className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">회사명</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" defaultValue="Acme Cloud" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">담당 팀</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" defaultValue="Product Operations" />
            </label>
          </div>
          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-700">기능명</span>
            <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" defaultValue="고객 지원 대화 요약 기능" />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-bold text-slate-700">기능 설명</span>
            <textarea
              className="mt-2 min-h-52 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 leading-7 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              defaultValue="상담원이 고객 문의 티켓을 빠르게 파악할 수 있도록 AI가 대화 내용을 요약하고 다음 액션을 제안합니다. 요약은 내부 상담 화면에만 표시됩니다."
            />
          </label>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-slate-50 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-black text-slate-950">Mock 모드로 질문 생성</p>
              <p className="mt-1 text-sm text-slate-500">제출 버튼은 샘플 프로젝트 질문 화면으로 이동합니다.</p>
            </div>
            <ButtonLink href="/projects/pilot-001">질문 생성하기</ButtonLink>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
