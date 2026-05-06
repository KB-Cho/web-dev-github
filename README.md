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
