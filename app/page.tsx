import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";

import { JourneySteps } from "@/components/JourneySteps";

import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";

const features = [
  "기능 설명을 정책 질문으로 자동 분해",

  "한 번에 하나씩 객관식 질문 답변",
  "답변 반영 정책서 초안 즉시 확인",
];

const journeySteps = [
  { title: "기능 입력", description: "예: 고객이 로그인을 한다" },
  { title: "질문 답변", description: "클릭할 필요 없이 다음 버튼으로 순차 진행" },
  { title: "초안 반영", description: "선택 답변과 추가 요청사항을 문서에 반영" },

  "보관, 권한, 리스크 항목을 구조화",
  "답변 기반 정책서 초안을 즉시 생성",

];

export default function Home() {
  return (
    <AppShell>
      <section className="grid items-center gap-10 rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-xl shadow-slate-200/70 backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
        <div>
          <SectionHeader
            eyebrow="Policy Operations Platform"
            title="AI 기능 출시 전, 정책서 초안을 더 빠르게 준비하세요."
            description="PolicyPilot은 SaaS 팀이 기능 설명만으로 개인정보, 보관 기간, 접근 권한, 리스크 대응 질문을 정리하고 정책서 초안을 만들 수 있게 돕는 B2B 프로토타입입니다."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/new">정책서 만들기</ButtonLink>

            <ButtonLink href="/projects/login-policy" variant="secondary">
              로그인 정책 데모 바로보기
            <ButtonLink href="/documents/pilot-001" variant="secondary">
              샘플 정책서 보기

            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <MetricCard label="초안 생성" value="10분" description="정책 담당자의 첫 문서 작성 시간을 단축" />
            <MetricCard label="체크 항목" value="24개" description="데이터, 보안, 운영 리스크 질문 라이브러리" />
            <MetricCard label="API 상태" value="Mock" description="실제 AI API 연결 전 검증 가능한 흐름" />
          </div>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-400/30">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <p className="text-sm font-bold text-teal-300">Policy readiness</p>
              <h2 className="mt-2 text-2xl font-black">고객 지원 AI 요약 기능</h2>
            </div>
            <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-200">Drafting</span>
          </div>
          <div className="mt-6 space-y-4">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
                  <p className="font-semibold">{feature}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-white p-5 text-slate-950">
            <p className="text-sm font-bold text-slate-500">다음 단계</p>
            <p className="mt-2 text-lg font-black">기능 설명 입력 → AI 질문 답변 → 정책서 초안 확인</p>
          </div>
        </div>
      </section>

      <JourneySteps steps={journeySteps} currentStep={1} />

    </AppShell>
  );
}
