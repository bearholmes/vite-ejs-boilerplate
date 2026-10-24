# 의존성 및 취약점 개선

점검일: 2026-10-25

## 수정 전 상태

`npm audit`에서 개발 의존성을 포함해 총 16건(높음 12건, 보통 4건)이
보고됐습니다. 직접 의존성 10개 모두 최신 안정 버전보다 뒤처져 있었습니다.
기존 빌드와 ESLint 검사는 통과했지만 Sass의 레거시 JavaScript API와
`@import` 사용 중단 경고가 발생했습니다.

## 업데이트 범위

| 패키지                       | 기존 설치 버전 | 적용 버전 |
| ---------------------------- | -------------- | --------- |
| Vite                         | 5.4.21         | 7.3.7     |
| EJS                          | 3.1.10         | 7.0.2     |
| ESLint                       | 9.39.1         | 10.13.0   |
| @eslint/js                   | 9.39.1         | 10.0.1    |
| glob                         | 11.1.0         | 13.0.6    |
| jQuery                       | 3.7.1          | 4.0.0     |
| Prettier                     | 3.7.1          | 3.9.10    |
| Sass                         | 1.94.2         | 1.106.1   |
| vite-plugin-live-reload      | 3.0.5          | 4.0.0     |
| vite-plugin-sass-glob-import | 3.0.2          | 6.0.3     |

Node.js 기본 버전을 Maintenance LTS인 22로 정하고 `.nvmrc`와 GitHub Pages
빌드가 같은 버전을 사용하도록 맞췄습니다. ESLint 10의 요구 사항에 따라 최소
22.13.0이 필요하며, `engines`는 22.13 이상인 22.x 또는 24 이상을 허용합니다.
메인 SCSS의 reset 로딩은 `@use`로 전환했습니다. 설치 버전은
`package-lock.json`으로 고정합니다.

## Vite 7을 선택한 이유

점검 당시 최신 Vite는 8.3.5이지만, SCSS glob 플러그인 6.0.3의
`peerDependencies.vite`는 `^6.0.0 || ^7.0.0`입니다. 기존 SCSS glob 기능을
유지하고 의존성 충돌 없이 설치할 수 있도록 Vite 7의 최신 패치를 적용했습니다.
따라서 `npm outdated`에 Vite 8이 표시되는 것은 의도된 보류입니다.

Vite 8로 전환할 때는 플러그인의 호환 지원을 확인하고 SCSS glob, EJS
렌더링, 개발 서버의 템플릿 새로고침과 프로덕션 빌드를 다시 검증해야 합니다.
`--force`, `--legacy-peer-deps` 또는 임의의 메이저 버전 override는 사용하지
않습니다.

참고: [Vite 마이그레이션 가이드](https://vite.dev/guide/migration),
[SCSS glob 플러그인](https://github.com/cmalven/vite-plugin-sass-glob-import),
[jQuery 4 업그레이드 가이드](https://jquery.com/upgrade-guide/4.0/).

## 검증 결과

- Node.js 22.23.4에서 `npm ci`, `npm run lint`, `npm run build` 통과.
- 잠금 파일을 기준으로 재설치한 뒤에도 `npm audit` 결과 총 0건.
- `npm ls --depth=0`에서 누락되거나 호환 범위를 벗어난 직접 의존성 없음.
- `npm outdated`는 Vite만 표시: current/wanted 7.3.7, latest 8.3.5.
- Sass 레거시 JavaScript API 및 `@import` 사용 중단 경고 해소.
- Node.js 22 개발 서버와 빌드 미리보기에서 `/`, `/pages/index.html`,
  `/pages/about.html`, `/pages/contact.html`, `/pages/util-demo.html`을 실제
  브라우저로 점검. 모든 페이지 HTTP 200, JavaScript 실행 오류 및 로컬 자산
  요청 오류 없음.
- 개발 서버와 빌드 미리보기에서 카운터 클릭 후 `count is 1` 표시 및 jQuery
  hover 클래스 추가 확인. 개발 서버에서 마우스를 벗어나면 클래스 제거 확인.
- 공통 EJS 헤더를 잠시 변경한 뒤 브라우저 자동 새로고침과 원본 복구 반영 확인.
- 임시 SCSS 파일 2개를 `@use` glob으로 불러오는 프로덕션 빌드 검증 통과.
  임시 파일은 제거하고 원본 스타일로 다시 빌드함.
- 변경 파일의 Prettier 검사 및 `git diff --check` 통과.

전체 `npm run format`에는 기존에도 있던 자동 생성 파일 `src/page-list.json`의
포맷 경고가 남아 있습니다. 이 파일은 빌드 시 다시 생성되므로 수정하지 않았습니다.
GitHub Pages 실제 배포는 실행하지 않았으며, 검증 범위는 로컬 빌드와 브라우저입니다.

## 재점검 명령

```bash
nvm use
npm ci
npm audit
npm outdated
npm run lint
npm run build
```

`npm audit` 결과는 점검 시점에 공개된 취약점 기준이며, 새로운 공지가 나오면
다시 확인해야 합니다. 의존성을 변경할 때는 `package.json`과
`package-lock.json`을 함께 반영하세요.
