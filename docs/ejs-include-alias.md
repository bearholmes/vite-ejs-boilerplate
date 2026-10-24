# EJS include의 @/ 별칭 지원

관련 이슈: [#2](https://github.com/bearholmes/vite-ejs-boilerplate/issues/2)

## 원인과 수정

기존 플러그인은 EJS 렌더링이 끝난 HTML에만 경로 별칭을 치환했습니다.
따라서 HTML의 자산 경로에는 `@/`를 사용할 수 있었지만, 렌더링 도중 실행되는
`include('@/templates/partials/header.ejs')`는 파일을 찾지 못했습니다.

EJS의 `includer` 옵션에서 include 경로를 해석하도록 수정했습니다.
Vite `resolve.alias`에 등록된 문자열 `@/` 또는 `@`의 `replacement`를 기준으로
`@/` include 경로를 해석합니다. 현재 설정에서는 `src/`가 기준입니다.
템플릿 소스나 JavaScript 표현식을 미리 문자열 치환하지 않습니다.

```ejs
<%- include('@/templates/partials/header.ejs') %>
<%- include('@/templates/partials/head') %>
```

`.ejs` 확장자 생략, 변수로 만든 include 경로 및 중첩 include를 지원합니다.
포함된 파일 안의 상대경로는 그 파일의 디렉터리를 기준으로 해석됩니다.
기존 `views` 및 `filename` 기반 상대경로 처리와 렌더링 후 HTML 자산 별칭
치환도 유지합니다. 임의의 별칭이나 정규식 별칭까지 include에 추가 지원하는
변경은 아닙니다.

사용자 지정 `ejs.includer`가 있으면 원래 include 문자열과 별칭이 해석된
파일 경로를 전달합니다. 사용자 훅이 반환하는 `filename` 또는 `template`을
우선 사용하며, 반환값이 없으면 기본 파일 로딩으로 이어집니다.
없는 파일은 오류로 처리합니다.

## 검증

별도 테스트 패키지 없이 Node.js 내장 테스트 러너로 실행합니다.

```bash
nvm use
npm test
npm run lint
npm run build
```

회귀 검사는 별칭 include, 확장자 생략, 중첩·상대경로 include, 동적 경로,
설정된 별칭 대상, 사용자 지정 includer, 없는 파일 오류 및 기존 HTML 자산
경로 치환을 확인합니다. `src/pages/util-demo.html`은 별칭 include를 사용하며
나머지 예제 페이지는 기존 경로를 유지합니다.

2026-10-25 검증 결과:

- Node.js 22.23.4에서 회귀 검사 9개, ESLint 및 프로덕션 빌드 통과.
- 수정 전 코드에서는 회귀 검사 중 별칭 관련 5개 실패, 수정 후 전체 통과.
- Node.js 22 개발 서버와 빌드 미리보기에서 전체 5개 페이지 HTTP 200.
  페이지별 공통 헤더·푸터가 각각 1개씩 렌더링됐으며 JavaScript 실행 오류와
  로컬 자산 요청 오류 없음.
- 별칭 include 데모에서 공통 스타일 로딩, 카운터 클릭 및 jQuery hover 확인.
- 별칭으로 포함한 공통 헤더를 임시 변경하고 복구했을 때 브라우저 자동
  새로고침이 두 변경을 모두 반영함.
- 변경 파일 Prettier 검사 및 `git diff --check` 통과.

전체 포맷 검사에는 기존 자동 생성 파일 `src/page-list.json`의 경고가 남아
있습니다. GitHub Pages 실제 배포는 검증 범위에 포함하지 않았습니다.
