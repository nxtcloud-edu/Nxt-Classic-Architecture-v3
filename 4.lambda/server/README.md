데이터베이스 구성 선행

디펜던시 설치 : `npm install express mysql2 dotenv cors axios`

실행 : `npm start` (개발 중 자동 재시작은 `npm run dev`)

`.env.example`을 `.env`로 복사한 뒤 DB 접속 정보와 두 Lambda Function URL을 채운다.

## AI 응답은 누가 DB에 쓰는가

- 사용자 노트(`user_note`)는 EC2 서버가 DB에 저장한다.
- AI 응답(`ai_note`, `ai_type`)은 Lambda가 직접 DB에 저장한다.
- 그래서 `/gemini-notes`, `/nova-notes` 핸들러는 Lambda 호출만 하고 DB에 쓰지 않는다.
  클라이언트는 10초 폴링으로 결과를 화면에 반영한다.
