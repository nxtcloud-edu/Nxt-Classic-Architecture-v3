3티어 아키텍처 기본 실습

## 배포 절차

의존성(`@google/genai`, `mysql2`)이 zip 안에 함께 들어가야 한다.
`npm install`을 건너뛰고 zip을 만들면 Lambda에서 `Cannot find module` 오류가 난다.

```
npm install
zip -r index.zip .
aws lambda update-function-code --function-name MyFunction --zip-file fileb://index.zip
```

핸들러는 `index.handler`로 설정한다.

## 환경 변수

| 이름 | 필수 | 설명 |
| --- | --- | --- |
| `GEMINI_API_KEY` | 필수 | Google AI Studio에서 발급한 API 키 |
| `GEMINI_MODEL` | 선택 | 미설정 시 `gemini-3.5-flash` |
| `DB_HOST` | 필수 | RDS 엔드포인트 |
| `DB_USER` | 필수 | DB 사용자 |
| `DB_PASSWORD` | 필수 | DB 비밀번호 |
| `DB_NAME` | 필수 | DB 이름 |

## 테스트

Lambda 콘솔의 테스트 이벤트로 아래 형식을 그대로 쓸 수 있다.
Function URL로 들어오는 `{"body": "..."}` 형식도 동일하게 처리된다.

```json
{ "content": "오늘 EC2를 배웠다", "noteId": 1 }
```
