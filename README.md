<div align="center">

# Vite + EJS Boilerplate

**빠르고 간편한 멀티페이지 웹 개발 스타터 킷**

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![EJS](https://img.shields.io/badge/EJS-3.1-90A93A?style=flat&logo=ejs&logoColor=white)](https://ejs.co/)
[![Sass](https://img.shields.io/badge/Sass-1.94-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[Features](#features) • [Quick Start](#quick-start) • [Project Structure](#project-structure) • [Documentation](#documentation)

</div>

---

## Overview

**Vite + EJS + SCSS** 기반의 현대적인 멀티페이지 애플리케이션 보일러플레이트입니다.
자동 페이지 인덱싱, 공통 레이아웃 관리, HMR(Hot Module Replacement)을 지원하여 빠른 개발 경험을 제공합니다.

### Features

- **초고속 개발 서버** - Vite 기반 번개같은 HMR 및 빌드
- **EJS 템플릿 엔진** - 강력한 템플릿 문법과 파셜 컴포넌트 재사용
- **자동 페이지 인덱싱** - 페이지 추가 시 `page-list.json` 자동 생성
- **SCSS 지원** - 모던 CSS 프리프로세서와 글로벌 임포트
- **경로 별칭** - `@/`로 간편한 절대 경로 사용
- **라이브 리로드** - 템플릿 변경 시 즉시 브라우저 새로고침
- **코드 품질** - ESLint + Prettier 설정 포함

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 또는 yarn

### Installation

```bash
# 저장소 클론
git clone <repository-url>
cd vite-ejs-boilerplate

# 의존성 설치
npm install

# 개발 서버 시작 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build
```

### Available Scripts

| Command                      | Description                         |
| ---------------------------- | ----------------------------------- |
| `npm run dev`                | 개발 서버 시작 (기본 포트: 3000)    |
| `npm run dev -- --port 4000` | 커스텀 포트로 개발 서버 시작        |
| `npm run build`              | 프로덕션 빌드 (`dist/` 폴더에 생성) |

---

## Project Structure

```
vite-ejs-boilerplate/
├── src/
│   ├── pages/              # 페이지 템플릿 (*.html, *.ejs)
│   │   ├── index.html      # 메인 페이지
│   │   ├── about.html
│   │   └── ...
│   ├── templates/
│   │   └── partials/       # 공통 레이아웃 컴포넌트
│   │       ├── head.ejs
│   │       ├── header.ejs
│   │       └── footer.ejs
│   ├── assets/
│   │   ├── styles/         # SCSS 스타일시트
│   │   │   └── style.scss  # 메인 스타일
│   │   ├── scripts/        # JavaScript 모듈
│   │   │   ├── util.js
│   │   │   └── counter.js
│   │   └── images/         # 이미지 자산
│   └── public/             # 정적 파일 (빌드 시 복사됨)
├── plugins/                # 커스텀 Vite 플러그인
│   ├── viteEjsPlugin.js
│   └── viteGenerateIndexPlugin.js
├── vite.config.js          # Vite 설정
├── page-list.json          # 자동 생성되는 페이지 인덱스
└── package.json
```

### Key Directories

| Directory                 | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `src/pages/`              | 실제 페이지 파일 (각 파일이 HTML 엔드포인트가 됨) |
| `src/templates/partials/` | 재사용 가능한 레이아웃 컴포넌트 (헤더, 푸터 등)   |
| `src/assets/`             | 스타일, 스크립트, 이미지 등의 자산                |
| `plugins/`                | EJS 렌더링 및 페이지 인덱스 생성 플러그인         |

---

## Documentation

### Page Template Format

각 페이지 파일 상단에 JSON 메타데이터를 작성하면 자동으로 `page-list.json`에 수집됩니다.

```ejs
<%#
{
  "group": "메인",
  "depth1": "홈",
  "remark": "랜딩 페이지",
  "class": "point_add"
}
#%>

<!DOCTYPE html>
<html lang="ko">
  <%- include('@/templates/partials/head.ejs', { title: '홈페이지' }) %>
  <body>
    <%- include('@/templates/partials/header.ejs') %>

    <!-- 페이지 콘텐츠 -->

    <%- include('@/templates/partials/footer.ejs') %>
  </body>
</html>
```

#### Metadata Fields

| Field    | Description             | Example                                     |
| -------- | ----------------------- | ------------------------------------------- |
| `group`  | 페이지 그룹/카테고리    | "메인", "서브"                              |
| `depth1` | 1차 depth 레이블        | "홈", "소개"                                |
| `depth2` | 2차 depth 레이블 (선택) | "팀 소개"                                   |
| `remark` | 페이지 설명/비고        | "랜딩 섹션"                                 |
| `class`  | 상태 표시 클래스        | `point_add`, `point_update`, `point_delete` |

#### Status Classes

- `point_add` - 신규 추가된 페이지
- `point_update` - 수정된 페이지
- `point_delete` - 보류/제외된 페이지

> **Note:** `page-list.json`은 빌드 시 자동 생성되므로 직접 수정하지 마세요.

---

### Styling Guide

#### SCSS Structure

`src/assets/styles/style.scss`가 메인 스타일시트입니다.

```scss
// 글로벌 변수 및 믹스인
$primary-color: #646cff;

// 페이지별 스타일 임포트
@import './pages/home';
```

#### Using Path Alias

```javascript
// 절대 경로 사용 (@/ = src/)
import '@/assets/styles/style.scss';
import { ready } from '@/assets/scripts/util.js';
```

---

### JavaScript Utilities

#### util.js - jQuery Helpers

```javascript
import { ready, hoverToggle } from '@/assets/scripts/util.js';

ready(() => {
  console.log('DOM Ready!');
  hoverToggle('.menu', 'is-active');
});
```

#### counter.js - Example Component

```javascript
import { setupCounter } from '@/assets/scripts/counter.js';

setupCounter(document.querySelector('#counter'));
```

---

### Configuration

#### Port Configuration

**방법 1:** `vite.config.js` 수정

```javascript
export default {
  server: {
    port: 4000 // 기본값: 3000
  }
};
```

**방법 2:** CLI 옵션 사용

```bash
npm run dev -- --port 4000
```

#### Code Style (Prettier)

- **Indentation:** 2 spaces
- **Quotes:** Single quotes
- **Semicolons:** Required
- **Line width:** 80 characters
- **Trailing commas:** None

---

## Contributing

### Commit Convention

Conventional Commits 스타일을 따릅니다.

```
feat: add user authentication page
fix: resolve navigation menu bug
docs: update README installation steps
style: format code with prettier
refactor: restructure utility functions
```

### Pull Request Guidelines

PR 생성 시 다음 사항을 포함해주세요:

- [ ] 변경 사항 요약
- [ ] 영향을 받는 파일/기능 범위
- [ ] 로컬 테스트 완료 (`npm run dev` & `npm run build`)
- [ ] UI 변경 시 스크린샷 첨부

---

## License

MIT License

---

<div align="center">

Made with Vite + EJS

</div>
