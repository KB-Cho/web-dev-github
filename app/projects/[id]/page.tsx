import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";

import { JourneySteps } from "@/components/JourneySteps";

import { MetricCard } from "@/components/MetricCard";
import { PolicyQuestionWizard } from "@/components/PolicyQuestionWizard";
import { QuestionCard } from "@/components/QuestionCard";
import { SectionHeader } from "@/components/SectionHeader";
import { decisionQuestions, detectedDomains, draftOutline, loginProject, policyQuestions, project } from "@/lib/mockData";


import { QuestionCard } from "@/components/QuestionCard";
import { SectionHeader } from "@/components/SectionHeader";
import { policyQuestions, project } from "@/lib/mockData";



type ProjectPageProps = {
  params: Promise<{ id: string }>;
};


const journeySteps = [
  { title: "기능 입력", description: "로그인 정책 시나리오 감지 완료" },
  { title: "질문 답변", description: "현재 단계: 객관식 선택과 추가 요청 입력" },
  { title: "초안 반영", description: "마지막 질문 후 자동으로 결과 이동" },
];


export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const isLoginProject = id === loginProject.id;

  if (isLoginProject) {
    return (
      <AppShell>

        <JourneySteps steps={journeySteps} currentStep={2} />

        <section className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-lg shadow-slate-200/70">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow={`Project ${id}`}
              title="로그인 정책 질문에 하나씩 답변하세요."
              description="입력 문장 '고객이 로그인을 한다'를 기반으로 로그인 정책 도메인을 감지하고, 고객이 많이 고민하지 않도록 객관식 안을 먼저 제시합니다."
            />
            <ButtonLink href="/new" variant="secondary">입력 수정</ButtonLink>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <MetricCard label="기능" value={loginProject.featureName} description="정책서 생성 대상 기능" />
            <MetricCard label="질문" value={`${decisionQuestions.length}개`} description="한 화면에 하나씩 진행" />
            <MetricCard label="도메인" value={`${detectedDomains.length}개`} description="자동 감지된 정책 영역" />
            <MetricCard label="상태" value="Mock" description="실제 AI API 미연결" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-black text-slate-950">detectedDomains</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {detectedDomains.map((domain) => (
                  <span key={domain} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">{domain}</span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-black text-slate-950">draftOutline</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                {draftOutline.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
        </section>
        <PolicyQuestionWizard questions={decisionQuestions} projectId={id} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-lg shadow-slate-200/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow={`Project ${id}`}
            title="AI가 생성한 정책 질문에 답변하세요."
            description="실제 AI API 대신 mock 데이터로 생성된 질문 목록입니다. 답변을 검토한 뒤 정책서 초안 화면으로 이동할 수 있습니다."
          />
          <ButtonLink href={`/documents/${id}`}>정책서 초안 생성</ButtonLink>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard label="기능" value={project.featureName} description="정책서 생성 대상 기능" />
          <MetricCard label="상태" value="4/4" description="Mock 질문 답변 완료" />
          <MetricCard label="소유자" value={project.owner} description="정책 검토 책임 팀" />
          <MetricCard label="생성일" value={project.createdAt} description="프로토타입 기준 날짜" />
        </div>
      </section>
      <section className="grid gap-5">
        {policyQuestions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </section>
    </AppShell>
  );
}
