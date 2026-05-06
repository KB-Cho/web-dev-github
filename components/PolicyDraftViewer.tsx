"use client";

import { useEffect, useMemo, useState } from "react";

import { ButtonLink } from "@/components/ButtonLink";

import { DocumentSection } from "@/components/DocumentSection";
import type { LoginAnswer, LoginPolicyDraft } from "@/lib/mockData";

const storageKey = "policypilot-login-answers";

type PolicyDraftViewerProps = {
  draft: LoginPolicyDraft;
  fallbackAnswers: LoginAnswer[];
};

export function PolicyDraftViewer({ draft, fallbackAnswers }: PolicyDraftViewerProps) {
  const [answers, setAnswers] = useState<LoginAnswer[]>(fallbackAnswers);

  useEffect(() => {
    const storedAnswers = window.localStorage.getItem(storageKey);

    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers) as LoginAnswer[]);
    }
  }, []);

  const answerSummary = useMemo(() => answers.map((answer) => {
    const additionalRequest = answer.additionalRequest.trim();
    return additionalRequest ? `${answer.selectedOption} / 추가 요청: ${additionalRequest}` : answer.selectedOption;
  }), [answers]);


  const additionalRequestCount = answers.filter((answer) => answer.additionalRequest.trim()).length;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="border-b border-slate-200 bg-slate-950 px-8 py-7 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-300">Internal Policy Draft</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">{draft.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{draft.summary}</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-4 text-sm font-bold text-slate-100">
            {answers.length}개 답변 · 추가 요청 {additionalRequestCount}개 반영
          </div>
        </div>
      </div>
      <section className="border-b border-slate-200 bg-teal-50 px-8 py-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black text-teal-800">답변 반영 요약</p>
            <p className="mt-2 text-sm leading-6 text-teal-900">질문 화면에서 선택한 객관식 답변과 추가 요청사항이 아래 초안 항목에 반영된 것처럼 표시됩니다.</p>
          </div>
          <ButtonLink href="/projects/login-policy" variant="secondary">답변 수정하기</ButtonLink>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="border-b border-slate-200 bg-slate-950 px-8 py-7 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-300">Internal Policy Draft</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{draft.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{draft.summary}</p>
      </div>
      <section className="border-b border-slate-200 bg-teal-50 px-8 py-7">
        <p className="text-sm font-black text-teal-800">답변 반영 요약</p>
        <div className="mt-4 grid gap-3">

          {answers.map((answer, index) => (
            <div key={answer.questionId} className="rounded-2xl border border-teal-100 bg-white p-4">
              <p className="text-sm font-black text-slate-950">{index + 1}. {answer.question}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">선택 답변: {answer.selectedOption}</p>
              {answer.additionalRequest ? <p className="mt-1 text-sm leading-6 text-teal-800">추가 요청 반영: {answer.additionalRequest}</p> : null}
            </div>
          ))}
        </div>
      </section>
      {draft.sections.map((section, index) => (
        <DocumentSection
          key={section.title}
          section={{
            ...section,
            bullets: [...section.bullets, `Mock 답변 반영: ${answerSummary[index] ?? "기본 정책안 적용"}`],
          }}
        />
      ))}
    </article>
  );
}
