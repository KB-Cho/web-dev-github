type DomainPriority = "high" | "medium" | "low";
type QuestionType = "single_select" | "multi_select" | "text";

type AnalyzePolicyResponse = {
  featureSummary: string;
  detectedDomains: Array<{
    name: string;
    reason: string;
    confidence: number;
  }>;
  questions: Array<{
    id: string;
    priority: DomainPriority;
    question: string;
    type: QuestionType;
    options: string[];
    reason: string;
    blocksSections: string[];
  }>;
  draftOutline: Array<{
    title: string;
    description: string;
  }>;
  assumptions: Array<{
    content: string;
    riskLevel: DomainPriority;
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

const policyAnalyzeSchema = {
  type: "object",
  additionalProperties: false,
  required: ["featureSummary", "detectedDomains", "questions", "draftOutline", "assumptions"],
  properties: {
    featureSummary: {
      type: "string",
      description: "입력된 기능 설명을 한국어 정책 검토 관점에서 1~2문장으로 요약한다.",
    },
    detectedDomains: {
      type: "array",
      description: "기능 설명에서 감지한 서비스 정책 도메인 목록",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "reason", "confidence"],
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
          confidence: { type: "number", minimum: 0, maximum: 1 },
        },
      },
    },
    questions: {
      type: "array",
      description: "정책서 섹션을 작성하기 전에 사용자가 결정해야 하는 질문 목록",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "priority", "question", "type", "options", "reason", "blocksSections"],
        properties: {
          id: { type: "string", pattern: "^[a-z0-9-]+$" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          question: { type: "string" },
          type: { type: "string", enum: ["single_select", "multi_select", "text"] },
          options: {
            type: "array",
            items: { type: "string" },
          },
          reason: { type: "string" },
          blocksSections: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    draftOutline: {
      type: "array",
      description: "답변을 바탕으로 작성할 정책서 초안 목차",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    assumptions: {
      type: "array",
      description: "입력만으로 단정할 수 없어 가정으로 둔 사항",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["content", "riskLevel"],
        properties: {
          content: { type: "string" },
          riskLevel: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
  },
} as const;

const systemPrompt = `당신은 한국어 SaaS 서비스 정책서 작성을 돕는 정책 운영 분석가입니다.
입력된 기능 설명을 분석해 서비스 정책 도메인, 의사결정 질문, 정책서 목차, 가정을 생성하세요.
반드시 한국어로 작성하세요.
한국 서비스 운영, 개인정보, 계정/권한, 보관/삭제, 로그/감사, 고객 고지, 예외 처리 관점에서 질문을 만드세요.
모르는 내용은 절대 단정하지 말고 assumptions 또는 questions에 넣으세요.
questions는 정책서 작성이 막히는 의사결정 항목을 우선순위 high/medium/low로 나누세요.
single_select 또는 multi_select 질문에는 사용자가 쉽게 고를 수 있는 options를 2~5개 제공하세요.
text 질문은 options를 빈 배열로 두세요.
blocksSections에는 해당 질문의 답변 없이는 작성하기 어려운 정책서 섹션명을 넣으세요.`;

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

function isAnalyzePolicyResponse(value: unknown): value is AnalyzePolicyResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as AnalyzePolicyResponse;

  return (
    typeof candidate.featureSummary === "string" &&
    Array.isArray(candidate.detectedDomains) &&
    Array.isArray(candidate.questions) &&
    Array.isArray(candidate.draftOutline) &&
    Array.isArray(candidate.assumptions)
  );
}

export async function POST(request: Request) {
  const env = getEnv();
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonResponse({ error: "OPENAI_API_KEY 환경변수가 설정되어 있지 않습니다." }, 500);
  }

  let body: { featureDescription?: unknown };

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "요청 본문은 JSON이어야 합니다." }, 400);
  }

  const featureDescription = typeof body.featureDescription === "string" ? body.featureDescription.trim() : "";

  if (!featureDescription) {
    return jsonResponse({ error: "featureDescription은 비어 있지 않은 문자열이어야 합니다." }, 400);
  }

  if (featureDescription.length > 4000) {
    return jsonResponse({ error: "featureDescription은 4000자 이하로 입력해 주세요." }, 400);
  }

  const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_POLICY_ANALYZE_MODEL ?? "gpt-5.2",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `다음 기능 설명을 분석해 JSON schema에 맞게 반환하세요.\n\n기능 설명:\n${featureDescription}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "policy_analysis_result",
          strict: true,
          schema: policyAnalyzeSchema,
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

    if (!isAnalyzePolicyResponse(parsed)) {
      return jsonResponse({ error: "OpenAI API 응답이 예상한 정책 분석 구조와 다릅니다." }, 502);
    }

    return jsonResponse(parsed);
  } catch {
    return jsonResponse({ error: "OpenAI API 응답 JSON 파싱에 실패했습니다." }, 502);
  }
}
