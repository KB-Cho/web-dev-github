import { AppShell } from "@/components/AppShell";
import { NewPolicyForm } from "@/components/NewPolicyForm";
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
            description="기능 설명에 '고객이 로그인을 한다'를 입력하면 로그인 정책 mock 질문 흐름으로 이동합니다."
          />
          <div className="mt-8 space-y-4">
            {guidance.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-teal-100 bg-teal-50 p-5 text-sm leading-6 text-teal-900">
            예시 입력: <span className="font-black">고객이 로그인을 한다</span>
          </div>
        </aside>
        <NewPolicyForm />
      </section>
    </AppShell>
  );
}
