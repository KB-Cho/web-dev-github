"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import type { DecisionQuestion, LoginAnswer } from "@/lib/mockData";

const storageKey = "policypilot-login-answers";

type PolicyQuestionWizardProps = {
  questions: DecisionQuestion[];
  projectId: string;
};

export function PolicyQuestionWizard({ questions, projectId }: PolicyQuestionWizardProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(questions.map((question) => [question.id, question.defaultAnswer])),
  );
  const [additionalRequests, setAdditionalRequests] = useState<Record<string, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<LoginAnswer[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = currentIndex + 1;
  const isLastQuestion = currentIndex === questions.length - 1;

  const currentAnswer = useMemo<LoginAnswer>(() => ({
    questionId: currentQuestion.id,
    question: currentQuestion.question,
    selectedOption: selectedOptions[currentQuestion.id] ?? currentQuestion.defaultAnswer,
    additionalRequest: additionalRequests[currentQuestion.id] ?? "",
  }), [additionalRequests, currentQuestion, selectedOptions]);

  function saveCurrentAnswer() {
    setSavedAnswers((previousAnswers) => {
      const otherAnswers = previousAnswers.filter((answer) => answer.questionId !== currentAnswer.questionId);
      return [...otherAnswers, currentAnswer];
    });
  }

  function handleNext() {
    saveCurrentAnswer();
    setCurrentIndex((previousIndex) => Math.min(previousIndex + 1, questions.length - 1));
  }

  function handlePrevious() {
    saveCurrentAnswer();
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  }

  function handleCreateDraft() {
    const mergedAnswers = [...savedAnswers.filter((answer) => answer.questionId !== currentAnswer.questionId), currentAnswer];
    const orderedAnswers = questions.map((question) => {
      const answer = mergedAnswers.find((candidate) => candidate.questionId === question.id);
      return answer ?? {
        questionId: question.id,
        question: question.question,
        selectedOption: question.defaultAnswer,
        additionalRequest: "",
      };
    });

    window.localStorage.setItem(storageKey, JSON.stringify(orderedAnswers));
    router.push(`/documents/${projectId}`);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-lg shadow-slate-200/70">
        <p className="text-sm font-black text-teal-700">답변 진행률</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${(progress / questions.length) * 100}%` }} />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-600">
          {progress} / {questions.length}개 질문
        </p>
        <div className="mt-6 space-y-3">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`rounded-2xl border p-4 text-sm font-bold ${
                index === currentIndex ? "border-teal-300 bg-teal-50 text-teal-900" : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {index + 1}. {question.category}
            </div>
          ))}
        </div>
      </aside>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="flex justify-start">
          <div className="max-w-2xl rounded-[1.5rem] rounded-tl-sm bg-slate-950 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-teal-300">PolicyPilot 질문 {progress}</p>
            <h2 className="mt-3 text-2xl font-black">{currentQuestion.question}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{currentQuestion.helper}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-2xl rounded-[1.5rem] rounded-tr-sm border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-black text-slate-700">먼저 가장 가까운 안을 선택해 주세요.</p>
            <div className="mt-4 grid gap-3">
              {currentQuestion.options.map((option) => (
                <label key={option} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    className="mt-1 h-4 w-4 accent-teal-600"
                    checked={(selectedOptions[currentQuestion.id] ?? currentQuestion.defaultAnswer) === option}
                    onChange={() => setSelectedOptions((previousOptions) => ({ ...previousOptions, [currentQuestion.id]: option }))}
                  />
                  <span className="text-sm font-bold leading-6 text-slate-800">{option}</span>
                </label>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-black text-slate-700">추가 요청사항</span>
              <textarea
                className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                placeholder="예: 보안팀 검토가 필요하다는 문구를 넣어주세요."
                value={additionalRequests[currentQuestion.id] ?? ""}
                onChange={(event) => setAdditionalRequests((previousRequests) => ({ ...previousRequests, [currentQuestion.id]: event.target.value }))}
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
          {currentIndex === 0 ? <ButtonLink href="/new" variant="secondary">입력으로 돌아가기</ButtonLink> : <button type="button" onClick={handlePrevious} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">이전 질문</button>}
          {isLastQuestion ? (
            <button type="button" onClick={handleCreateDraft} className="rounded-full bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-700">정책서 초안 생성</button>
          ) : (
            <button type="button" onClick={handleNext} className="rounded-full bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-700">다음 질문</button>
          )}
        </div>
      </div>
    </section>
  );
}
