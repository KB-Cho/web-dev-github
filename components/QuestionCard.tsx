import type { PolicyQuestion } from "@/lib/mockData";

type QuestionCardProps = {
  question: PolicyQuestion;
  index: number;
};

export function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-sm font-black text-teal-700">{index + 1}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{question.category}</span>
          </div>
          <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950">{question.question}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{question.helper}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Mock 답변 입력됨</span>
      </div>
      <textarea
        className="mt-5 min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
        defaultValue={question.answer}
      />
    </article>
  );
}
