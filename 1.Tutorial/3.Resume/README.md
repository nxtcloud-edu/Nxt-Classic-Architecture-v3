# 3.Resume — 인터랙티브 이력서

React로 만든 1페이지 이력서다. S3에 정적 배포하고, Lambda + DynamoDB로 방문자수·좋아요 카운터를 붙이는 실습(Resume Challenge)의 프론트엔드에 해당한다.

빌드 도구는 Vite, 스타일은 Tailwind CSS, 차트는 Recharts를 쓴다.

## 실행

```bash
npm install
npm start          # http://localhost:3000
```

배포용 정적 파일 만들기:

```bash
npm run build      # dist/ 생성
npm run preview    # 빌드 결과를 로컬에서 확인
```

S3에 배포할 때는 `dist/` 안의 파일을 버킷 루트에 올린다. 방법은 `../2.html/index.html` 튜토리얼을 참고한다.

## LAMBDA_URL 채우기

`src/config.js`의 `LAMBDA_URL`이 비어 있으면 카운터는 네트워크 요청을 보내지 않고 "Lambda URL을 설정하세요"만 표시한다. 앱은 정상 동작하므로, Lambda 없이 이력서만 먼저 배포해도 된다.

`4.lambda` 실습에서 만든 함수 URL을 넣으면 카운터가 살아난다.

```js
// src/config.js
export const LAMBDA_URL = 'https://abc123.lambda-url.ap-northeast-2.on.aws';
```

끝에 슬래시(`/`)는 넣지 않는다. 앱은 이 URL에 세 개의 경로를 호출한다.

| 메서드 | 경로 | 응답 | 쓰임 |
|---|---|---|---|
| GET | `/visit` | `{ "visits": 42 }` | 방문자수 표시 |
| GET | `/likes` | `{ "likes": 7 }` | 좋아요 수 표시 |
| POST | `/like` | `{ "likes": 8 }` | 좋아요 버튼 |

브라우저에서 호출하므로 Lambda 쪽에 **CORS 허용 설정**이 필요하다. 값이 안 뜨면 브라우저 개발자 도구의 콘솔과 네트워크 탭을 먼저 확인한다.

## 내 이력서로 바꾸기

내용은 전부 `src/data/resume.js` 한 파일에 있다. **이 파일만 고치면 되고 컴포넌트는 건드릴 필요가 없다.**

| 항목 | 설명 |
|---|---|
| `profile` | 이름, 한 줄 소개, 요약 |
| `contacts` | 연락처. `href`를 빼면 링크가 아닌 텍스트로 표시된다 |
| `experienceData` | 연도별 성장 추이 (꺾은선 차트) |
| `projectMix` | 프로젝트 경험 구성비 (도넛 차트). `value` 합이 100이 되게 맞춘다 |
| `achievements` | 주요 성과 |
| `education` | 교육 이수 (아코디언) |
| `projects` | 프로젝트 (아코디언) |
| `skills` | 기술 태그 |

브라우저 탭 제목은 `index.html`의 `<title>`에서 바꾼다.

## 색 바꾸기

색은 전부 `src/index.css` 상단의 CSS 변수로 정의돼 있다. `:root`가 라이트, `.dark`가 다크다. 두 블록의 값만 고치면 앱 전체 색이 따라 바뀐다.

차트 색만 따로 관리한다 — `src/lib/chartPalette.js`. 색맹 사용자도 계열을 구분할 수 있도록 검증된 조합이라, 바꿀 때는 대비를 함께 확인한다.

## 구조

```
src/
  config.js              LAMBDA_URL (학생이 채우는 곳)
  data/resume.js         이력서 내용 (학생이 고치는 곳)
  hooks/useCounters.js   Lambda 카운터 호출
  lib/chartPalette.js    차트 색
  components/            화면 조각들
    charts/              Recharts 차트
  App.jsx                전체 조립
```
