# AI 학습 노트 — 서버

Express + MySQL + Gemini로 동작하는 백엔드다. 데이터베이스 구성이 선행되어야 한다.

## 설치

```bash
npm install express mysql2 dotenv cors @google/genai
```

이미 `package.json`이 있으므로 `npm install`만 실행해도 동일하다.

## 환경 변수

`.env.example`을 `.env`로 복사한 뒤 값을 채운다.

| 변수 | 설명 |
| --- | --- |
| `DB_HOST` | MySQL 호스트 |
| `DB_USER` | MySQL 사용자 |
| `DB_PASSWORD` | MySQL 비밀번호 |
| `DB_NAME` | 데이터베이스 이름 |
| `GEMINI_API_KEY` | Gemini API 키 |
| `GEMINI_MODEL` | 사용할 모델 (기본값 `gemini-3.6-flash`) |

## 실행

```bash
npm start   # node server.js
npm run dev # node --watch server.js (파일 변경 시 자동 재시작)
```

서버는 80번 포트를 사용한다. 리눅스/맥에서는 1024 미만 포트라 관리자 권한이 필요하다.

## API

| 메서드 | 경로 | 설명 |
| --- | --- | --- |
| `GET` | `/` | 서버·DB·Gemini 상태 확인 |
| `GET` | `/notes` | 전체 메모 조회 (최신순) |
| `POST` | `/notes` | 메모 저장. `{ "content": "..." }` |
| `POST` | `/ainotes` | 기존 메모에 AI 조언 (재)요청. `{ "id": 1 }` |
| `DELETE` | `/notes/:id` | 특정 메모 삭제 |
| `DELETE` | `/notes` | 전체 메모 삭제 |

### POST /notes 동작

사용자 메모를 **먼저 저장하고 201을 즉시 응답**한다. Gemini 분석은 응답 이후 백그라운드에서 진행되어 성공하면
`ai_note`가 채워지고, 실패하면 콘솔에만 기록된다. 즉 AI가 실패해도 사용자가 쓴 메모는 유실되지 않는다.
클라이언트는 10초 주기 폴링으로 분석 결과를 자연스럽게 받아 간다.

### POST /ainotes 동작

`ai_note`가 비어 있는 메모를 다시 분석할 때 쓴다. `{ "id": <노트 id> }`가 기본 형태이고,
id 없이 `{ "content": "<메모 본문>" }`만 보내면 같은 본문의 최신 메모를 찾아 처리한다.
