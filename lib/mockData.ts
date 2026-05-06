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

export const project = {
  id: "pilot-001",
  companyName: "Acme Cloud",
  featureName: "고객 지원 대화 요약 기능",
  owner: "Product Operations",
  status: "질문 답변 대기",
  createdAt: "2026.05.06",
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
