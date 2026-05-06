import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { DocumentSection } from "@/components/DocumentSection";
import { MetricCard } from "@/components/MetricCard";
import { PolicyDraftViewer } from "@/components/PolicyDraftViewer";
import { SectionHeader } from "@/components/SectionHeader";
import { assumptions, decisionQuestions, documentSections, loginProject, policyDraft, project } from "@/lib/mockData";

type DocumentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const isLoginProject = id === loginProject.id;

  if (isLoginProject) {
    const fallbackAnswers = decisionQuestions.map((question) => ({
      questionId: question.id,
      question: question.question,
      selectedOption: question.defaultAnswer,
      additionalRequest: "",
    }));

    return (
      <AppShell>
        <section className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-lg shadow-slate-200/70">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow={`Document ${id}`}
              title="로그인 정책서 초안"
              description="질문별 객관식 답변과 추가 요청사항이 정책서에 반영된 것처럼 보여주는 mock 결과 화면입니다."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/projects/${id}`} variant="secondary">질문으로 돌아가기</ButtonLink>
              <ButtonLink href="/new">새 정책서 만들기</ButtonLink>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="회사" value={loginProject.companyName} description="정책 적용 조직" />
            <MetricCard label="문서 상태" value="초안" description="법무/보안 검토 전 단계" />
            <MetricCard label="답변" value={`${decisionQuestions.length}개`} description="정책서 반영 mock" />
          </div>
          <div className="mt-8 rounded-3xl bg-white p-5">
            <p className="text-sm font-black text-slate-950">assumptions</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
              {assumptions.map((assumption) => <li key={assumption}>• {assumption}</li>)}
            </ul>
          </div>
        </section>
        <PolicyDraftViewer draft={policyDraft} fallbackAnswers={fallbackAnswers} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-lg shadow-slate-200/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow={`Document ${id}`}
            title="정책서 초안"
            description="질문 답변을 바탕으로 구성된 mock 정책서 초안입니다. 실제 서비스에서는 AI 모델 호출 결과와 승인 워크플로가 연결됩니다."
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/projects/${id}`} variant="secondary">
              질문으로 돌아가기
            </ButtonLink>
            <ButtonLink href="/new">새 정책서 만들기</ButtonLink>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard label="회사" value={project.companyName} description="정책 적용 조직" />
          <MetricCard label="문서 상태" value="초안" description="법무/보안 검토 전 단계" />
          <MetricCard label="섹션" value={`${documentSections.length}개`} description="Mock 문서 구성 단위" />
        </div>
      </section>
      <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="border-b border-slate-200 bg-slate-950 px-8 py-7 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-300">Internal Policy Draft</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">{project.featureName} 운영 정책서</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">본 문서는 PolicyPilot 프로토타입에서 생성한 mock 초안이며 최종 정책으로 사용하기 전 담당 부서 검토가 필요합니다.</p>
        </div>
        {documentSections.map((section) => (
          <DocumentSection key={section.title} section={section} />
        ))}
      </article>
    </AppShell>
  );
}
