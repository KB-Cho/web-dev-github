# PolicyPilot API

이 브랜치는 `main` 기준으로 새로 시작한 최소 변경입니다. 기존 UI/mock PR을 이어서 수정하지 않고, 정책서 초안 생성 API route만 추가합니다.

## API: `POST /api/policy/generate`

사용자의 기능 설명, AI가 생성한 질문, 사용자의 답변을 바탕으로 정책서 초안을 생성합니다.

### 요청 형식

```json
{
  "featureDescription": "고객이 로그인을 한다",
  "questions": [
    {
      "id": "login-methods",
      "question": "어떤 로그인 수단을 지원하나요?",
      "type": "single_select",
      "options": ["이메일 + 비밀번호", "간편로그인"]
    }
  ],
  "answers": [
    {
      "questionId": "login-methods",
      "answer": "이메일 + 비밀번호와 간편로그인을 모두 지원합니다."
    }
  ]
}
```

### 응답 형식

응답은 OpenAI Structured Outputs JSON Schema를 사용해 아래 구조를 따르도록 요청합니다.

```json
{
  "title": "string",
  "sections": [
    {
      "title": "string",
      "content": "string",
      "status": "complete"
    }
  ],
  "openIssues": [
    {
      "issue": "string",
      "reason": "string",
      "recommendedQuestion": "string"
    }
  ],
  "riskNotes": [
    {
      "risk": "string",
      "severity": "medium",
      "suggestion": "string"
    }
  ]
}
```

### 정책서 문체 기준

- 실무 서비스 기획자가 작성한 것처럼 구체적으로 작성합니다.
- 개발자, 디자이너, QA, CS가 이해할 수 있는 운영 정책 문장으로 작성합니다.
- 애매하거나 답변이 부족한 부분은 단정하지 않고 `openIssues` 또는 `assumption_based` / `needs_decision` 섹션으로 분리합니다.

### 환경변수

```bash
OPENAI_API_KEY=sk-...
```

선택적으로 모델을 변경할 수 있습니다.

```bash
OPENAI_POLICY_GENERATE_MODEL=gpt-5.2
```

## 로컬 확인

```bash
npm install
npm run typecheck
npm run build
```

현재 Codex 실행 환경에서는 프록시가 npm registry 접근을 `403 Forbidden`으로 차단할 수 있으므로, 로컬 또는 Vercel처럼 registry 접근이 가능한 환경에서 다시 검증해 주세요.
