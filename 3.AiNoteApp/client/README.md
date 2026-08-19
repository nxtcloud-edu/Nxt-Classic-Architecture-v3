# AI 학습 노트 — 클라이언트

React 19 + Vite로 만든 프론트엔드다. 백엔드(`../server`)가 먼저 떠 있어야 동작한다.

## 설치

```bash
npm install
```

## 환경 변수

`.env.example`을 `.env`로 복사한 뒤 백엔드 주소를 채운다.

```bash
cp .env.example .env
```

```
VITE_SERVER_URL=http://localhost
```

Vite는 `VITE_` 접두사가 붙은 변수만 노출하며, **값은 빌드 시점에 코드로 주입된다.**
따라서 주소를 바꾸면 개발 서버를 재시작하거나 다시 빌드해야 한다.
값이 비어 있으면 화면에 설정 안내가 표시되고 서버 요청은 보내지 않는다.

## 실행

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm start        # 위와 동일
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

배포할 때는 `dist/` 디렉터리의 내용을 웹 서버(S3, Nginx 등)에 올리면 된다.

## 디자인 · 테마

- 색·radius·그림자·폰트는 전부 `src/App.css` 상단의 CSS 변수 토큰을 경유한다. 컴포넌트 규칙에 hex 를 직접 쓰지 않는다.
- 토큰은 3계층이다. `:root`(라이트 기본) → `@media (prefers-color-scheme: dark)`(OS 선호) →
  `:root[data-theme]`(헤더 토글이 OS 선호를 이긴다).
- 헤더 우측 버튼이 `OS 설정 → 라이트 → 다크` 순으로 순환하며, 선택값은 localStorage(`aiNote.theme`)에 남는다.
- 본문 글꼴은 Pretendard Variable(dynamic subset CDN)이고, 로드에 실패하면 시스템 산세리프로 떨어진다.

## 동작 메모

- 노트를 저장하면 서버가 곧바로 응답하고 AI 분석은 백그라운드에서 진행된다. 분석이 끝나기 전까지
  해당 노트에는 점 애니메이션과 스켈레톤으로 "분석 중"이 표시되고, 10초 주기 폴링으로 결과가
  도착하면 자동으로 교체된다.
- AI 분석이 실패해 `ai_note`가 비어 있는 노트에는 "Gemini 조언 요청" 버튼이 나타난다.
  이 버튼은 `POST /ainotes`로 재요청을 보낸다.
- AI 응답은 마크다운으로 렌더링된다(`react-markdown` + `remark-gfm`).
