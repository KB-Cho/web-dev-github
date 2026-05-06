import { AppShell } from "@/components/AppShell";
import { ButtonLink } from "@/components/ButtonLink";
import { MetricCard } from "@/components/MetricCard";
import { QuestionCard } from "@/components/QuestionCard";
import { SectionHeader } from "@/components/SectionHeader";
import { policyQuestions, project } from "@/lib/mockData";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

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
