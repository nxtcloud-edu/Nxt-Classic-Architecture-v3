# AI 학습 노트 (서버리스) — 클라이언트

Vite + React 19로 만든 프론트엔드다.

## 실행

```
npm install
cp .env.example .env      # VITE_SERVER_URL을 EC2 주소로 채운다
npm run dev               # http://localhost:3000
```

프로덕션 빌드는 `npm run build`이며 결과물은 `dist/`에 생성된다.
빌드 결과를 로컬에서 확인하려면 `npm run preview`.

## 환경 변수

| 이름 | 설명 |
| --- | --- |
| `VITE_SERVER_URL` | EC2 서버 주소 (예: `http://13.125.0.1`) |

Vite는 `VITE_` 접두사가 붙은 변수만 클라이언트 코드에 노출한다.
`.env`를 고친 뒤에는 개발 서버를 다시 시작해야 반영된다.
값이 없으면 앱이 안내 화면을 띄운다.

## AI 응답이 바로 보이지 않는 이유

AI 응답은 EC2가 아니라 Lambda가 DB에 직접 저장한다.
그래서 조언 요청 버튼을 눌러도 응답이 즉시 화면에 나타나지 않고,
10초 주기 폴링이 DB에서 결과를 가져올 때 표시된다.
그동안 해당 노트에는 "분석 중" 표시가 남는다.
