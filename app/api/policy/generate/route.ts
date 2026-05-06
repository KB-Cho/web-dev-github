type SectionStatus = "complete" | "needs_decision" | "assumption_based";
type Severity = "high" | "medium" | "low";
type QuestionType = "single_select" | "multi_select" | "text";

type Question = {
  id: string;
  question: string;
  type?: QuestionType;
  options?: string[];
  reason?: string;
  blocksSections?: string[];
};

type Answer = {
  questionId: string;
  answer: string | string[];
  additionalRequest?: string;
};

type GeneratePolicyRequest = {
  featureDescription: string;
  questions: Question[];
  answers: Answer[];
};

type GeneratePolicyResponse = {
  title: string;
  sections: Array<{
    title: string;
    content: string;
    status: SectionStatus;
  }>;
  openIssues: Array<{
    issue: string;
    reason: string;
    recommendedQuestion: string;
  }>;
  riskNotes: Array<{
    risk: string;
    severity: Severity;
    suggestion: string;
  }>;
};

type ResponsesApiContent = {
  type?: string;
  text?: string;
};

type ResponsesApiOutputItem = {
  content?: ResponsesApiContent[];
};

type ResponsesApiPayload = {
  output_text?: string;
  output?: ResponsesApiOutputItem[];
  error?: {
    message?: string;
  };
};

const policyGenerateSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "sections", "openIssues", "riskNotes"],
  properties: {
    title: {
      type: "string",
      description: "정책서 초안 제목",
    },
    sections: {
      type: "array",
      description: "정책서 본문 섹션",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "content", "status"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          status: { type: "string", enum: ["complete", "needs_decision", "assumption_based"] },
        },
      },
    },
    openIssues: {
      type: "array",
      description: "답변이 부족하거나 모호해 정책서에 단정할 수 없는 미결정 항목",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["issue", "reason", "recommendedQuestion"],
        properties: {
          issue: { type: "string" },
          reason: { type: "string" },
          recommendedQuestion: { type: "string" },
        },
      },
    },
    riskNotes: {
      type: "array",
      description: "정책 적용 시 주의해야 할 리스크와 개선 제안",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["risk", "severity", "suggestion"],
        properties: {
          risk: { type: "string" },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          suggestion: { type: "string" },
        },
      },
    },
  },
} as const;

const systemPrompt = `당신은 한국어 SaaS 서비스 정책서를 작성하는 실무 서비스 기획자입니다.
사용자의 기능 설명, AI가 생성한 질문, 사용자의 답변을 바탕으로 정책서 초안을 작성하세요.
문체는 개발자, 디자이너, QA, CS가 이해할 수 있게 구체적이고 실행 가능한 운영 정책 문장이어야 합니다.
답변으로 확인된 내용은 complete 섹션에 반영하세요.
답변은 없지만 합리적 가정으로 초안을 이어갈 수 있는 부분은 assumption_based 섹션으로 작성하고 가정임을 content에 명시하세요.
답변이 부족하거나 애매해서 단정하면 안 되는 내용은 needs_decision 섹션 또는 openIssues로 분리하세요.
개인정보, 계정/권한, 보관/삭제, 로그/감사, 고객 고지, 예외 처리, 운영 모니터링, CS 대응 관점을 검토하세요.
없는 내용을 확정된 정책처럼 쓰지 마세요.`;

export const runtime = "nodejs";

function getEnv() {
  return (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
}

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function extractOutputText(payload: ResponsesApiPayload) {
  if (payload.output_text) {
    return payload.output_text;
  }

  return payload.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" || typeof content.text === "string")
    .map((content) => content.text ?? "")
    .join("")
    .trim();
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isQuestion(value: unknown): value is Question {
  return isStringRecord(value) && typeof value.id === "string" && typeof value.question === "string";
}

function isAnswer(value: unknown): value is Answer {
  if (!isStringRecord(value) || typeof value.questionId !== "string") {
    return false;
  }

  return typeof value.answer === "string" || (Array.isArray(value.answer) && value.answer.every((item) => typeof item === "string"));
}

function isGeneratePolicyResponse(value: unknown): value is GeneratePolicyResponse {
  if (!isStringRecord(value)) {
    return false;
  }

  return (
    typeof value.title === "string" &&
    Array.isArray(value.sections) &&
    Array.isArray(value.openIssues) &&
    Array.isArray(value.riskNotes)
  );
}

function validateRequestBody(value: unknown): GeneratePolicyRequest | { error: string } {
  if (!isStringRecord(value)) {
    return { error: "요청 본문은 JSON object여야 합니다." };
  }

  const featureDescription = typeof value.featureDescription === "string" ? value.featureDescription.trim() : "";

  if (!featureDescription) {
    return { error: "featureDescription은 비어 있지 않은 문자열이어야 합니다." };
  }

  if (featureDescription.length > 4000) {
    return { error: "featureDescription은 4000자 이하로 입력해 주세요." };
  }

  if (!Array.isArray(value.questions) || !value.questions.every(isQuestion)) {
    return { error: "questions는 id와 question을 포함한 Question 배열이어야 합니다." };
  }

  if (!Array.isArray(value.answers) || !value.answers.every(isAnswer)) {
    return { error: "answers는 questionId와 answer를 포함한 Answer 배열이어야 합니다." };
  }

  return {
    featureDescription,
    questions: value.questions,
    answers: value.answers,
  };
}

export async function POST(request: Request) {
  const env = getEnv();
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonResponse({ error: "OPENAI_API_KEY 환경변수가 설정되어 있지 않습니다." }, 500);
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return jsonResponse({ error: "요청 본문은 JSON이어야 합니다." }, 400);
  }

  const validatedBody = validateRequestBody(requestBody);

  if ("error" in validatedBody) {
    return jsonResponse({ error: validatedBody.error }, 400);
  }

  const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_POLICY_GENERATE_MODEL ?? "gpt-5.2",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `아래 입력을 바탕으로 정책서 초안을 JSON Schema에 맞게 생성하세요.\n\n${JSON.stringify(validatedBody, null, 2)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "policy_draft_result",
          strict: true,
          schema: policyGenerateSchema,
        },
      },
    }),
  });

  const payload = (await openaiResponse.json()) as ResponsesApiPayload;

  if (!openaiResponse.ok) {
    return jsonResponse(
      { error: "OpenAI API 요청에 실패했습니다.", detail: payload.error?.message ?? "알 수 없는 오류" },
      openaiResponse.status,
    );
  }

  const outputText = extractOutputText(payload);

  if (!outputText) {
    return jsonResponse({ error: "OpenAI API 응답에서 JSON 텍스트를 찾지 못했습니다." }, 502);
  }

  try {
    const parsed = JSON.parse(outputText) as unknown;

    if (!isGeneratePolicyResponse(parsed)) {
      return jsonResponse({ error: "OpenAI API 응답이 예상한 정책서 초안 구조와 다릅니다." }, 502);
    }

    return jsonResponse(parsed);
  } catch {
    return jsonResponse({ error: "OpenAI API 응답 JSON 파싱에 실패했습니다." }, 502);
  }
}
