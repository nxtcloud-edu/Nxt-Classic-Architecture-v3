# GOTCHAS

버그를 우회하기 전에 근본 원인을 기록한다. (v3 디벨롭, 2026-08-19)

## 튜토리얼 문서 — 리전 가정 오류

- **증상**: 2.html S3 가이드가 서울 리전(ap-northeast-2) 기준으로 작성됨. 실습 표준은 us-east-1 (Bedrock 모델 액세스도 us-east-1 기준).
- **근본 원인**: 문서 재작성 시 "이 수업의 모든 실습은 us-east-1"이라는 운영 전제를 확인하지 않고 한국 수업 = 서울 리전으로 가정. S3 웹사이트 엔드포인트는 리전마다 형식이 달라(us-east-1은 `s3-website-us-east-1` 대시, 서울은 `s3-website.ap-northeast-2` 점) 리전만 바꾸면 안 되고 엔드포인트 형식도 함께 바꿔야 한다.
- **교훈**: 실습 문서를 만들 때 리전·계정 전제를 먼저 확인하고, 리전 표기는 grep으로 전수 점검한다.

## 3.AiNoteApp — AI 실패 시 노트 유실

- **증상**: Gemini 호출이 실패(쿼터 초과·키 오류)하면 학생이 작성한 노트가 저장되지 않고 사라짐.
- **근본 원인**: `POST /notes`가 AI 호출 **성공 후에야** INSERT하는 순서. AI 가용성이 데이터 저장의 전제조건이 되어 있었다.
- **수정**: INSERT 먼저 → 201 즉시 응답 → AI는 백그라운드 UPDATE. 실패해도 노트는 남는다.

## 3.AiNoteApp — 죽은 `/ainotes` 404

- **증상**: "Gemini 조언 요청" 버튼 클릭 시 404.
- **근본 원인**: 클라이언트는 `POST /ainotes`를 호출하는데 서버에 해당 라우트가 없었음. 클라이언트-서버가 서로 다른 시점에 수정되며 API 계약이 어긋난 것.
- **수정**: 서버에 `POST /ainotes`(기존 노트 AI 재요청) 신설. 저장-우선 흐름 도입으로 이 버튼이 재시도 수단으로 의미를 갖게 됨.

## 2.RandomTextApp — `split("by")` 파싱 깨짐

- **증상**: 명언 본문에 "by"가 포함되면 본문/저자가 엉뚱하게 분리됨.
- **근본 원인**: 서버가 `"명언 by 저자"` 문자열 하나로 합쳐 보내고 클라이언트가 문자열 파싱으로 복원하는 구조. 구분자가 데이터에 등장할 수 있는 값이었다.
- **수정**: API가 `{ text, username }` 구조화 JSON을 반환하도록 계약 변경.

## 4.lambda — EC2의 AI 응답 이중 UPDATE

- **증상**: Lambda가 `ai_type='nova'`로 저장한 행을 EC2가 다시 UPDATE(과거엔 `'claude'`로 덮어씀).
- **근본 원인**: 설계 원칙(사용자 노트=EC2, AI 응답=Lambda)이 코드에 반영되지 않고 양쪽 모두 쓰기를 수행. 또한 "AI 쓰기를 EC2로 옮기기" 개인과제의 정답 코드가 미리 노출되는 문제.
- **수정**: EC2 쪽 UPDATE 제거. 결과는 클라이언트 폴링으로 반영.

## 4.lambda — 콘솔 테스트 이벤트 즉사

- **증상**: Lambda 콘솔에서 `{"content":"...","noteId":1}` 테스트 실행 시 `KeyError: 'body'` / `JSON.parse(undefined)`.
- **근본 원인**: Function URL 페이로드(`event.body` JSON 문자열)만 가정하고 직접 호출 페이로드(평면 객체)를 고려하지 않은 이벤트 파싱.
- **수정**: 두 형식을 모두 받는 파서 도입.

## 1.Tutorial/4.ResearcherProfile — 한글 렌더링 깨짐

- **증상**: 화면에 `체계���으로` 등 U+FFFD 문자가 그대로 표시.
- **근본 원인**: 파일 저장/복사 과정에서 UTF-8 멀티바이트 시퀀스 일부가 손상된 채 커밋됨(replacement character로 치환된 상태가 소스에 고정).
- **수정**: 손상된 3개 문자열 복원. 인코딩 손상은 diff에서 잘 보이지 않으므로 `grep -n '�'`로 검출.

## 1.Tutorial/3.Resume — 마운트 즉시 unhandled rejection

- **증상**: 앱 실행 직후 콘솔에 fetch 에러, 방문자 수 영원히 0.
- **근본 원인**: `LAMBDA_URL=''`(학생이 채우는 빈칸)인 상태에서 fetch를 무조건 실행 + `.catch()` 부재. "빈칸" 상태가 정상 상태로 설계되지 않았음.
- **수정**: URL 미설정 시 fetch를 건너뛰고 안내 표시. 빈칸 자체는 실습 장치로 유지.

## Recharts 3 — 테마 토글 시 파이 차트 소실

- **증상**: 다크↔라이트 토글로 색 prop이 바뀌면 진입 애니메이션이 재시작하다 0 각도에서 멈춰 도넛 차트가 통째로 사라짐. 빌드는 정상 통과 — 브라우저 실측으로만 발견 가능.
- **근본 원인**: Recharts 3의 진입 애니메이션이 prop 변경 시 재시작되는 동작과 테마 토글의 상호작용.
- **수정**: 차트에 `isAnimationActive={false}` 지정 (1.Tutorial/3.Resume).

## lucide-react 1.x — 브랜드 아이콘 제거됨

- **증상**: `Github`/`Linkedin` import가 빌드 에러.
- **근본 원인**: lucide-react가 1.x에서 브랜드 아이콘을 삭제(라이선스 정책). 구버전 코드의 import가 그대로 남아 있었음.
- **수정**: 일반 아이콘(`Code`/`Briefcase`)으로 대체. 브랜드 로고가 필요하면 `simple-icons` 계열을 별도 도입해야 한다.

## Vite + `"type": "module"` — CommonJS 설정 파일 충돌

- **증상**: package.json에 `"type": "module"` 추가 시 postcss.config.js / tailwind.config.js(CommonJS)에서 빌드 실패.
- **근본 원인**: `.js` 확장자가 ESM으로 해석되어 `module.exports`가 무효화됨.
- **수정**: 두 설정 파일을 `export default`(ESM)로 전환 (3.Resume, 4.ResearcherProfile).

## 1.Tutorial/2.html — 게임 시작 전 mousemove 크래시

- **증상**: 시작 버튼 누르기 전 캔버스 위에서 마우스를 움직이면 `Cannot read properties of undefined`.
- **근본 원인**: `mousemove` 핸들러의 가드가 `if (gameOver) return`뿐인데, 시작 전에는 `player`와 `gameOver` 모두 `undefined`라 가드를 통과.
- **수정**: `player` 존재 가드 추가.
