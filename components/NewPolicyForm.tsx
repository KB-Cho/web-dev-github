"use client";

import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";

const loginTrigger = "고객이 로그인을 한다";

export function NewPolicyForm() {
  const [featureDescription, setFeatureDescription] = useState(loginTrigger);

  const targetProject = useMemo(() => {
    const normalizedDescription = featureDescription.replace(/\s/g, "");
    const normalizedTrigger = loginTrigger.replace(/\s/g, "");

    return normalizedDescription.includes(normalizedTrigger) || normalizedDescription.includes("로그인")
      ? "login-policy"
      : "pilot-001";
  }, [featureDescription]);

  const isLoginScenario = targetProject === "login-policy";

  return (
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
        <span className="text-sm font-bold text-slate-700">기능 설명</span>
        <textarea
          className="mt-2 min-h-48 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 leading-7 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
          value={featureDescription}
          onChange={(event) => setFeatureDescription(event.target.value)}
        />
      </label>
      <div className="mt-5 rounded-3xl border border-teal-100 bg-teal-50 p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black text-teal-800">다음에 진행될 흐름</p>
            <p className="mt-2 text-sm leading-6 text-teal-900">
              {isLoginScenario
                ? "로그인 정책 도메인을 감지했습니다. 다음 화면에서 질문이 한 개씩 나타나고, 마지막에는 답변이 반영된 정책서 초안으로 이동합니다."
                : "로그인 문장이 아니면 기존 고객 지원 요약 기능 mock 질문으로 이동합니다."}
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-teal-700">{isLoginScenario ? "로그인 정책" : "일반 정책"}</span>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center">
        <div>
          <p className="font-black">정책 질문으로 이어서 진행</p>
          <p className="mt-1 text-sm text-slate-300">입력 → 질문 답변 → 정책서 반영까지 끊기지 않도록 다음 화면으로 이동합니다.</p>
        </div>
        <ButtonLink href={`/projects/${targetProject}`}>{isLoginScenario ? "로그인 정책 질문 시작" : "질문 생성하기"}</ButtonLink>

        <p className="text-sm font-black text-teal-800">Mock 감지 결과</p>
        <p className="mt-2 text-sm leading-6 text-teal-900">
          {isLoginScenario
            ? "입력에서 로그인 도메인을 감지했습니다. 로그인 정책 질문을 한 화면에 하나씩 객관식으로 진행합니다."
            : "로그인 문장이 아니면 기존 고객 지원 요약 기능 mock 질문으로 이동합니다."}
        </p>
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl bg-slate-50 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-black text-slate-950">Mock 모드로 질문 생성</p>
          <p className="mt-1 text-sm text-slate-500">제출 버튼은 감지된 mock 프로젝트 질문 화면으로 이동합니다.</p>
        </div>
        <ButtonLink href={`/projects/${targetProject}`}>질문 생성하기</ButtonLink>

      </div>
    </form>
  );
}
