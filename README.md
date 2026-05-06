# PolicyPilot

PolicyPilot은 Next.js + TypeScript + Tailwind CSS로 만든 SaaS 정책서 생성 프로토타입입니다. 현재는 실제 AI API를 연결하지 않고 mock 데이터로 화면 흐름을 확인할 수 있습니다.

## 현재 확인된 설치 문제 요약

이 저장소의 `package.json` 구성은 Next.js 프로젝트로서 정상적인 형태입니다. `dev`, `build`, `lint`, `typecheck` 스크립트가 있고, `next`, `react`, `react-dom`, `tailwindcss`, `typescript`, `eslint-config-next` 등 필요한 패키지가 선언되어 있습니다.

현재 환경에서 `npm install`이 실패하는 가장 큰 원인은 코드 문제가 아니라 **npm 패키지를 내려받는 네트워크/프록시/레지스트리 접근 문제**입니다.

확인한 내용:

- 프로젝트 안에는 원래 `.npmrc`가 없었습니다.
- 혼동을 줄이기 위해 `.npmrc`를 추가했고, 공식 npm registry인 `https://registry.npmjs.org/`를 명시했습니다.
- 그래도 이 실행 환경에서는 `HTTP_PROXY`, `HTTPS_PROXY`가 `http://proxy:8080`으로 잡혀 있고, 해당 프록시가 npm registry 접속을 `403 Forbidden`으로 막고 있습니다.
- 그래서 `react`, `next`, `eslint-config-next` 같은 패키지가 `node_modules`에 설치되지 못합니다.
- 설치가 안 되었기 때문에 TypeScript와 ESLint가 관련 타입/패키지를 찾지 못하는 오류가 이어서 발생합니다.

쉽게 말하면, 현재 오류 흐름은 아래와 같습니다.

```text
npm install 실패
→ node_modules 생성 실패
→ next/react 타입 없음
→ npm run typecheck 실패
→ eslint-config-next 없음
→ npm run lint 실패
→ next 실행 파일 없음
→ npm run build 실패
```

## 로컬에서 화면 확인하는 방법

아래 단계는 개발자가 아닌 기획자도 그대로 따라 할 수 있도록 적었습니다.

### 1. Node.js 설치

먼저 Node.js LTS 버전을 설치합니다.

- 권장: Node.js 20 이상
- 다운로드: https://nodejs.org/

설치 후 터미널에서 아래 명령어로 확인합니다.

```bash
node -v
npm -v
```

### 2. 프로젝트 폴더로 이동

```bash
cd web-dev-github
```

### 3. 패키지 설치

```bash
npm install
```

정상이라면 `node_modules` 폴더와 `package-lock.json` 파일이 생깁니다.

만약 `403 Forbidden`이 나오면 코드 문제가 아니라 회사망, VPN, 프록시, 사내 보안 정책, npm registry 접근 권한 문제일 가능성이 큽니다. 이 경우 아래를 확인해 주세요.

```bash
npm config get registry
```

출력이 아래와 같으면 registry 주소 자체는 정상입니다.

```text
https://registry.npmjs.org/
```

그래도 실패한다면 다음 중 하나를 시도해 보세요.

- 회사 VPN을 끄거나 다른 네트워크에서 다시 시도
- 사내 보안/IT 담당자에게 npm registry 접근 허용 요청
- 사내 npm mirror registry가 있다면 IT 담당자가 안내한 registry로 `.npmrc` 수정
- 프록시 환경변수(`HTTP_PROXY`, `HTTPS_PROXY`)가 잘못 설정되어 있지 않은지 확인

### 4. 개발 서버 실행

```bash
npm run dev
```

터미널에 표시되는 주소를 브라우저에서 엽니다. 보통 아래 주소입니다.

```text
http://localhost:3000
```

### 5. 화면 경로

- 홈: `http://localhost:3000/`
- 새 정책서 생성: `http://localhost:3000/new`
- 질문 답변: `http://localhost:3000/projects/demo-project`
- 정책서 결과: `http://localhost:3000/documents/demo-document`

## 점검 명령어

패키지 설치가 성공한 뒤에는 아래 명령어로 프로젝트 상태를 확인할 수 있습니다.

```bash
npm run typecheck
npm run lint
npm run build
```

각 명령어의 의미는 다음과 같습니다.

- `npm run typecheck`: TypeScript 타입 오류가 있는지 확인합니다.
- `npm run lint`: 코드 스타일과 잠재 오류를 확인합니다.
- `npm run build`: 배포 가능한 Next.js 빌드를 생성할 수 있는지 확인합니다.

## Vercel Preview로 확인하는 방법

Vercel을 사용하면 로컬 설치가 어려운 경우에도 브라우저에서 Preview URL로 화면을 확인할 수 있습니다.

### GitHub 연동 방식

1. 이 저장소를 GitHub에 push합니다.
2. https://vercel.com/ 에 로그인합니다.
3. **Add New... → Project**를 선택합니다.
4. GitHub 저장소를 Import합니다.
5. Framework Preset이 **Next.js**로 자동 감지되는지 확인합니다.
6. 별도 환경변수는 아직 필요 없습니다. 실제 AI API를 연결하지 않고 mock 데이터만 사용하기 때문입니다.
7. Deploy를 누릅니다.
8. 배포가 끝나면 Vercel이 Preview URL을 제공합니다.

### PR Preview 방식

GitHub 저장소와 Vercel 프로젝트를 연결해 두면, 이후 Pull Request를 만들 때마다 Vercel이 자동으로 Preview 배포를 생성합니다. 기획자는 PR 화면의 Vercel Preview 링크를 눌러 변경된 화면을 확인할 수 있습니다.

## 문제 원인 판단 기준

이번처럼 `npm install`에서 `403 Forbidden`이 먼저 발생했다면 대부분은 코드 문제가 아닙니다. 설치가 끝나지 않았기 때문에 뒤따르는 TypeScript, ESLint, Build 오류도 연쇄적으로 발생합니다.

반대로 `npm install`은 성공했는데 `npm run typecheck`, `npm run lint`, `npm run build`만 실패한다면 그때는 코드나 설정 문제일 가능성이 커집니다.

## PR 설명에 반영해야 할 검증 메모

이번 PR의 설치/검증 실패는 애플리케이션 코드가 npm 패키지를 잘못 요청해서 생긴 문제가 아니라, **Codex 실행 환경의 프록시/네트워크가 npm registry 접근을 `403 Forbidden`으로 차단해서 생긴 문제**입니다.

PR 설명에는 아래 사실을 명확히 남겨야 합니다.

1. `package.json` 구성은 확인되었고, Next.js 실행/빌드/검사용 스크립트와 필요한 의존성이 선언되어 있습니다.
2. `.npmrc`에는 공식 npm registry인 `https://registry.npmjs.org/`를 명시했습니다.
3. `npm config get registry` 실행 결과는 `https://registry.npmjs.org/`입니다.
4. `curl`과 `npm install`은 현재 Codex 실행 환경의 프록시 때문에 `403 Forbidden`이 발생했습니다.
5. `npm run typecheck`, `npm run lint`, `npm run build` 실패는 `node_modules`가 설치되지 않은 상태에서 발생한 후속 실패입니다.
6. 실제 로컬 환경 또는 Vercel Preview 환경에서 `npm install`과 `npm run build`를 다시 검증해야 합니다.

## Vercel에서 404: NOT_FOUND가 보일 때

첨부된 Vercel 화면의 `404: NOT_FOUND`는 브라우저가 요청한 URL에서 Vercel이 배포된 Next.js 페이지를 찾지 못했다는 뜻입니다. 현재 프로젝트에는 `/` 홈 화면이 있으므로, 정상 배포가 완료된 올바른 Preview URL이라면 홈 화면이 표시되어야 합니다.

우선 아래를 확인해 주세요.

- Vercel 배포가 **Failed**가 아니라 **Ready** 상태인지 확인합니다.
- GitHub 저장소와 연결된 Vercel 프로젝트의 **Root Directory**가 이 프로젝트 폴더를 가리키는지 확인합니다.
- Vercel이 Framework Preset을 **Next.js**로 감지했는지 확인합니다.
- Preview URL 뒤에 잘못된 경로나 오래된 배포 URL이 붙어 있지 않은지 확인합니다.
- 배포 로그에서 `npm install` 또는 `npm run build`가 실패하지 않았는지 확인합니다.

만약 Vercel 로그에서도 npm registry 접근 오류나 build 실패가 보이면, Vercel 환경에서의 설치/빌드 로그를 기준으로 다시 원인을 확인해야 합니다.

## App Router / Vercel 404 코드 체크리스트

Vercel Preview에서 `404: NOT_FOUND`가 계속 표시될 때, 코드 기준으로는 아래 항목을 먼저 확인했습니다.

- 홈 화면 파일은 Next.js App Router 규칙에 맞게 `app/page.tsx`로 존재합니다.
- 루트 레이아웃 파일은 `app/layout.tsx`로 존재하며, `<html lang="ko">`와 `<body>{children}</body>`를 렌더링합니다.
- 새 정책서 생성 화면은 `/new` 경로에 대응하는 `app/new/page.tsx`로 존재합니다.
- 정책 질문 답변 화면은 `/projects/[id]` 경로에 대응하는 `app/projects/[id]/page.tsx`로 존재합니다.
- 정책서 결과 화면은 `/documents/[id]` 경로에 대응하는 `app/documents/[id]/page.tsx`로 존재합니다.
- `next.config.ts`는 현재 빈 설정 객체를 export하므로 `basePath`, `redirects`, `rewrites`, `output` 설정 때문에 Vercel 라우팅이 깨질 가능성은 코드상 확인되지 않았습니다.

따라서 현재 코드 구조만 보면 `/` 페이지가 없는 상태는 아닙니다. Vercel에서 계속 404가 보인다면 코드 라우트 누락보다는 **Vercel 프로젝트 설정, 배포 대상 브랜치/커밋, Root Directory, 빌드 실패, 또는 잘못된 Preview URL**을 먼저 의심해야 합니다.

### Vercel Root Directory 설정

Vercel 프로젝트의 **Root Directory는 반드시 `package.json`이 있는 폴더**로 설정되어야 합니다.

이 저장소에서는 `package.json`, `app/`, `components/`, `lib/`, `next.config.ts`가 같은 프로젝트 루트에 있어야 합니다. Vercel이 다른 상위/하위 폴더를 Root Directory로 잡으면 Next.js 앱을 찾지 못하거나 엉뚱한 배포가 만들어져 `404: NOT_FOUND`가 표시될 수 있습니다.

Vercel에서 확인할 위치:

1. Vercel 프로젝트로 이동합니다.
2. **Settings → General**로 이동합니다.
3. **Root Directory**가 `package.json`이 있는 폴더인지 확인합니다.
4. Root Directory를 수정했다면 다시 Deploy합니다.
5. 새로 생성된 Preview URL의 `/` 경로를 엽니다.

## PR Testing에 남길 Vercel 상태

현재 첨부된 Vercel Preview 화면에서는 `404: NOT_FOUND`가 계속 표시되고 있으므로, PR Testing에는 이 이슈가 **아직 미해결 상태**라고 남겨야 합니다.

다만 코드 기준으로는 `app/page.tsx`, `app/layout.tsx`, `/new`, `/projects/[id]`, `/documents/[id]` 라우트 파일이 존재하고, `next.config.ts`에도 라우팅을 깨뜨릴 수 있는 `basePath`, `redirects`, `rewrites`, `output` 설정이 없습니다. 따라서 Vercel Preview 404는 Vercel 설정/배포 로그/Preview URL을 추가로 확인해야 합니다.

## Vercel Production 배포 오류: `public` Output Directory

Vercel Production Build Log에 아래 오류가 표시되면, Next.js 앱 자체가 `/` 페이지를 만들지 못했다는 뜻이 아니라 **Vercel 프로젝트의 Output Directory 설정이 잘못되었을 가능성**이 큽니다.

```text
Error: No Output Directory named "public" found after the Build completed.
```

이 프로젝트는 Next.js 앱이므로 빌드 결과가 정적 사이트처럼 `public/` 폴더에 만들어지지 않습니다. `public/`은 이미지, favicon 같은 정적 파일을 넣는 입력 폴더에 가깝습니다. Vercel의 **Next.js Framework Preset**을 사용하면 배포 결과물 위치는 Vercel이 자동으로 처리합니다.

이번 수정에서는 `vercel.json`에 꼭 필요한 최소 설정만 남겼습니다. `outputDirectory`는 직접 지정하지 않고 Vercel의 Next.js Framework Preset이 처리하게 두는 것이 더 안전합니다.

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build"
}
```

Vercel 대시보드에서도 아래 설정을 함께 확인해 주세요.

- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build`
- **Output Directory**: `public`로 되어 있으면 안 됩니다. Next.js 프로젝트에서는 보통 비워 두어 Vercel의 Next.js Framework Preset이 자동으로 처리하게 하는 것이 안전합니다.
- **Root Directory**: `package.json`이 있는 폴더

비개발자 관점에서 요약하면, Vercel이 "Next.js 앱 결과물"을 자동으로 처리한 것이 아니라 "public이라는 폴더"를 배포 결과물로 찾고 있어서 실패한 상황입니다. 그래서 Vercel 설정을 Next.js 기준으로 맞추되, Output Directory는 직접 지정하지 않도록 정리했습니다.

## PR Testing에 남길 Production 배포 상태

Vercel Production의 `No Output Directory named "public" found` 오류를 해결하기 위해 `vercel.json`에는 Next.js Framework Preset과 Build Command만 남겼지만, 실제 Production 배포 성공 여부는 Vercel에서 다시 배포해 확인해야 합니다.

현재 Codex 실행 환경에서는 npm registry 접근이 프록시로 차단되어 `npm install` 및 `npm run build`를 끝까지 검증할 수 없으므로, Vercel Production 또는 로컬 네트워크에서 재배포/재빌드 확인이 필요합니다.

## 로그인 정책 mock 시나리오

`/new` 화면의 기능 설명에 아래 문장을 입력하면 로그인 정책 전용 mock 흐름으로 이동합니다.

```text
고객이 로그인을 한다
```

이 경우 PolicyPilot은 실제 AI API를 호출하지 않고, 미리 준비된 mock 데이터로 아래 결과를 보여줍니다.

- `detectedDomains`: 인증, 계정 보안, 세션 관리, 회원 상태, 로그/감사
- `decisionQuestions`: 로그인 정책을 결정하기 위한 객관식 질문 목록
- `draftOutline`: 결과 정책서의 목차 초안
- `assumptions`: mock 결과를 만들 때 사용한 가정
- `policyDraft`: 로그인 정책서 초안

질문 화면은 고객이 많이 고민하지 않아도 되도록 **한 화면에 하나의 질문만** 보여주며, 채팅처럼 PolicyPilot 질문과 사용자 답변 영역을 나누어 표시합니다. 각 질문은 먼저 객관식 안을 제시하고, 필요하면 사용자가 추가 요청사항을 입력할 수 있습니다.

포함된 로그인 정책 질문은 다음과 같습니다.

1. 어떤 로그인 수단을 지원하나요?
2. 간편로그인은 어떤 제공자를 지원하나요?
3. 로그인 실패 횟수 제한이 있나요?
4. 자동 로그인을 지원하나요?
5. 탈퇴 회원이 로그인하면 어떻게 처리하나요?
6. 휴면 회원 정책이 있나요?
7. 로그인 이벤트 로그를 수집하나요?

마지막 질문에서 **정책서 초안 생성**을 누르면 `/documents/login-policy`로 이동합니다. 이 결과 화면은 브라우저의 `localStorage`에 저장된 답변을 읽어, 사용자가 선택한 객관식 답변과 추가 요청사항이 정책서 초안에 반영된 것처럼 보여줍니다.
