export type PolicyQuestion = {
  id: string;
  category: string;
  question: string;
  helper: string;
  answer: string;
};

export type PolicySection = {
  title: string;
  body: string;
  bullets: string[];
};

export type DecisionQuestion = {
  id: string;
  category: string;
  question: string;
  helper: string;
  options: string[];
  defaultAnswer: string;
};

export type LoginAnswer = {
  questionId: string;
  question: string;
  selectedOption: string;
  additionalRequest: string;
};

export type LoginPolicyDraft = {
  title: string;
  summary: string;
  sections: PolicySection[];
};

export const project = {
  id: "pilot-001",
  companyName: "Acme Cloud",
  featureName: "고객 지원 대화 요약 기능",
  owner: "Product Operations",
  status: "질문 답변 대기",
  createdAt: "2026.05.06",
};

export const loginProject = {
  id: "login-policy",
  companyName: "Acme Cloud",
  featureName: "고객 로그인 기능",
  owner: "Product Operations",
  status: "로그인 정책 질문 답변 중",
  createdAt: "2026.05.06",
  triggerInput: "고객이 로그인을 한다",
};

export const detectedDomains = ["인증", "계정 보안", "세션 관리", "회원 상태", "로그/감사"];

export const decisionQuestions: DecisionQuestion[] = [
  {
    id: "login-methods",
    category: "로그인 수단",
    question: "어떤 로그인 수단을 지원하나요?",
    helper: "고객이 계정에 접근할 때 허용되는 인증 방식을 정합니다.",
    options: ["이메일 + 비밀번호", "휴대폰 번호 + 인증번호", "이메일/비밀번호와 간편로그인 모두 지원"],
    defaultAnswer: "이메일/비밀번호와 간편로그인 모두 지원",
  },
  {
    id: "social-providers",
    category: "간편로그인",
    question: "간편로그인은 어떤 제공자를 지원하나요?",
    helper: "외부 인증 제공자를 정책서에 명확히 남깁니다.",
    options: ["Google, Apple, Kakao", "Google, Apple", "간편로그인 미지원"],
    defaultAnswer: "Google, Apple, Kakao",
  },
  {
    id: "failure-limit",
    category: "보안 제한",
    question: "로그인 실패 횟수 제한이 있나요?",
    helper: "무차별 대입 공격을 줄이기 위한 잠금 기준을 정합니다.",
    options: ["5회 실패 시 10분 잠금", "10회 실패 시 30분 잠금", "제한 없음"],
    defaultAnswer: "5회 실패 시 10분 잠금",
  },
  {
    id: "remember-me",
    category: "세션 유지",
    question: "자동 로그인을 지원하나요?",
    helper: "자동 로그인 허용 여부와 세션 만료 기준을 정합니다.",
    options: ["고객 선택 시 30일 유지", "고객 선택 시 7일 유지", "자동 로그인 미지원"],
    defaultAnswer: "고객 선택 시 30일 유지",
  },
  {
    id: "withdrawn-member",
    category: "탈퇴 회원",
    question: "탈퇴 회원이 로그인하면 어떻게 처리하나요?",
    helper: "탈퇴 계정의 재접근, 복구, 재가입 안내 방식을 정합니다.",
    options: ["로그인 차단 후 재가입 안내", "30일 이내 복구 안내", "고객센터 문의 안내"],
    defaultAnswer: "로그인 차단 후 재가입 안내",
  },
  {
    id: "dormant-member",
    category: "휴면 회원",
    question: "휴면 회원 정책이 있나요?",
    helper: "장기 미접속 계정의 보호와 재활성화 절차를 정합니다.",
    options: ["12개월 미접속 시 휴면 전환", "24개월 미접속 시 휴면 전환", "휴면 정책 없음"],
    defaultAnswer: "12개월 미접속 시 휴면 전환",
  },
  {
    id: "login-event-log",
    category: "로그 수집",
    question: "로그인 이벤트 로그를 수집하나요?",
    helper: "보안 감사와 고객 보호를 위한 로그 수집 범위를 정합니다.",
    options: ["성공/실패, IP, 기기, 시간 수집", "성공/실패와 시간만 수집", "로그 수집 안 함"],
    defaultAnswer: "성공/실패, IP, 기기, 시간 수집",
  },
];

export const draftOutline = [
  "로그인 수단 및 인증 제공자",
  "로그인 실패 제한과 계정 잠금",
  "자동 로그인 및 세션 유지",
  "탈퇴/휴면 회원 처리",
  "로그인 이벤트 로그 수집 및 보관",
];

export const assumptions = [
  "입력 문장 '고객이 로그인을 한다'를 고객 계정 인증 기능 출시로 해석했습니다.",
  "정책 초안은 개인정보 처리방침 원문이 아니라 제품/운영팀이 검토할 내부 운영 정책서 형식입니다.",
  "사용자가 선택한 객관식 답변과 추가 요청사항이 최종 정책서 초안에 반영된 것처럼 mock으로 표시됩니다.",
];

export const policyDraft: LoginPolicyDraft = {
  title: "고객 로그인 기능 운영 정책서 초안",
  summary: "고객 로그인 기능은 인증 수단, 계정 보안, 세션 유지, 회원 상태 처리, 이벤트 로그 수집 기준을 일관되게 운영하기 위해 아래 정책을 따른다.",
  sections: [
    {
      title: "1. 로그인 수단 및 간편로그인",
      body: "서비스는 승인된 로그인 수단만 제공하며, 간편로그인 제공자는 제품 정책과 보안 검토 결과에 따라 운영한다.",
      bullets: [
        "지원 로그인 수단은 정책서에 명시하고 변경 시 사전 공지한다.",
        "간편로그인 제공자 변경 시 인증/회원 매핑 영향도를 점검한다.",
        "로그인 화면에서는 고객이 선택 가능한 수단을 명확히 표시한다.",
      ],
    },
    {
      title: "2. 로그인 실패 제한",
      body: "반복적인 로그인 실패는 계정 탈취 시도로 간주할 수 있으므로 실패 횟수와 잠금 기준을 적용한다.",
      bullets: [
        "실패 제한 기준은 고객 안내 문구와 내부 운영 가이드에 동일하게 반영한다.",
        "잠금 해제 방식은 본인 확인 또는 시간이 지난 후 자동 해제로 제한한다.",
        "비정상 시도 패턴은 보안 모니터링 대상으로 분류한다.",
      ],
    },
    {
      title: "3. 자동 로그인 및 세션 유지",
      body: "자동 로그인은 고객 선택에 따라 제공하며, 세션 유지 기간과 해제 조건을 명확히 관리한다.",
      bullets: [
        "공용 기기에서는 자동 로그인 사용에 대한 주의 문구를 제공한다.",
        "비밀번호 변경, 탈퇴, 보안 위험 감지 시 기존 세션을 만료한다.",
        "세션 정책 변경은 고객 경험과 보안 리스크를 함께 검토한다.",
      ],
    },
    {
      title: "4. 탈퇴 및 휴면 회원 처리",
      body: "탈퇴 회원과 휴면 회원은 일반 활성 회원과 구분하여 로그인 가능 여부와 안내 절차를 운영한다.",
      bullets: [
        "탈퇴 회원 로그인 시 재가입 또는 복구 가능 여부를 명확히 안내한다.",
        "휴면 회원은 재활성화 절차를 거친 뒤 서비스를 이용할 수 있게 한다.",
        "회원 상태 변경 이력은 고객 문의 대응을 위해 추적 가능해야 한다.",
      ],
    },
    {
      title: "5. 로그인 이벤트 로그",
      body: "로그인 이벤트 로그는 보안 감사, 이상 징후 탐지, 고객 문의 대응 목적으로 최소한의 범위에서 수집한다.",
      bullets: [
        "수집 항목과 보관 기간은 내부 보안 정책 및 개인정보 기준에 맞춘다.",
        "로그 접근 권한은 보안/운영 담당자로 제한한다.",
        "로그를 분석 목적으로 사용할 경우 개인 식별 가능성을 최소화한다.",
      ],
    },
  ],
};

export const policyQuestions: PolicyQuestion[] = [
  {
    id: "q1",
    category: "데이터 수집",
    question: "이 기능이 처리하는 고객 데이터의 범위는 어디까지인가요?",
    helper: "개인정보, 계정 정보, 대화 로그, 첨부 파일 등 포함 여부를 정리합니다.",
    answer: "고객 지원 티켓의 대화 본문, 티켓 메타데이터, 담당자 코멘트를 처리하며 결제 정보와 첨부 파일은 제외합니다.",
  },
  {
    id: "q2",
    category: "보관 기간",
    question: "생성된 요약과 원본 데이터는 얼마 동안 보관되나요?",
    helper: "규정 준수와 고객 계약 조건에 맞춘 보관/삭제 기준을 확인합니다.",
    answer: "요약 데이터는 12개월, 원본 대화 로그는 기존 고객 계약에 따라 24개월 보관 후 자동 삭제합니다.",
  },
  {
    id: "q3",
    category: "권한 관리",
    question: "누가 정책 대상 기능과 산출물에 접근할 수 있나요?",
    helper: "관리자, 담당자, 감사자 등 역할별 접근 범위를 정의합니다.",
    answer: "지원팀 매니저와 배정된 상담원만 접근할 수 있으며 감사자는 읽기 전용 권한을 갖습니다.",
  },
  {
    id: "q4",
    category: "리스크 대응",
    question: "AI 요약 오류나 민감정보 노출 가능성에 대한 대응 절차가 있나요?",
    helper: "휴먼 리뷰, 신고 채널, 롤백, 모니터링 정책을 문서화합니다.",
    answer: "상담원이 고객 전송 전 요약을 검토하고, 민감정보 감지 시 마스킹 후 보안팀에 자동 알림을 전송합니다.",
  },
];

export const documentSections: PolicySection[] = [
  {
    title: "1. 목적 및 적용 범위",
    body: "본 정책서는 Acme Cloud의 고객 지원 대화 요약 기능이 고객 데이터를 안전하고 일관되게 처리하도록 하기 위한 내부 운영 기준을 정의한다.",
    bullets: [
      "대상 기능: 고객 지원 대화 요약 기능",
      "적용 부서: Product Operations, Support, Security",
      "정책 소유자: Product Operations",
    ],
  },
  {
    title: "2. 데이터 처리 원칙",
    body: "기능은 고객 지원 티켓의 대화 본문, 티켓 메타데이터, 담당자 코멘트만 처리하며 결제 정보 및 첨부 파일은 처리 대상에서 제외한다.",
    bullets: [
      "최소 필요 데이터만 수집 및 처리한다.",
      "민감정보 탐지 시 자동 마스킹을 우선 적용한다.",
      "처리 기록은 감사 로그로 남기고 무단 변경을 제한한다.",
    ],
  },
  {
    title: "3. 보관 및 삭제",
    body: "생성된 요약 데이터는 12개월간 보관하고 원본 대화 로그는 고객 계약 기준에 따라 24개월 보관 후 자동 삭제한다.",
    bullets: [
      "삭제 정책은 월 1회 샘플링 검증한다.",
      "고객 삭제 요청은 접수 후 30일 이내 처리한다.",
      "예외 보관은 법무 승인과 만료일을 필수로 기록한다.",
    ],
  },
  {
    title: "4. 검토 및 사고 대응",
    body: "상담원은 고객에게 공유하기 전 AI 요약을 검토해야 하며, 오류 또는 민감정보 노출이 의심될 경우 즉시 보안팀에 신고한다.",
    bullets: [
      "고위험 요약은 매니저 승인 후 공유한다.",
      "보안 알림은 Slack 및 이메일로 동시에 전송한다.",
      "사고 대응 결과는 정책 개선 백로그에 반영한다.",
    ],
  },
];
