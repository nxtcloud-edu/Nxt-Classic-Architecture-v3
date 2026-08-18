# client-univ

랜덤 명언 앱의 프론트엔드. Vite + React 19.

## 실행 방법

```bash
npm install

# 서버 주소 설정
cp .env.example .env
# .env 를 열어 VITE_SERVER_URL 을 채운다. 예: VITE_SERVER_URL=http://12.34.56.78:8000

npm run dev     # 개발 서버 (http://localhost:3000)
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (3000번 포트) |
| `npm start` | `npm run dev` 와 동일 |
| `npm run build` | 배포용 정적 파일을 `dist/` 에 생성 |
| `npm run preview` | 빌드 결과를 로컬에서 확인 |

## 서버 IP 가 바뀌면 반드시 다시 빌드해야 한다

`VITE_SERVER_URL` 은 **빌드 시점에** 번들 코드 안에 문자열로 박힌다. 이미 만들어진
`dist/` 는 예전 주소를 그대로 들고 있으므로, `.env` 만 고쳐도 배포된 화면은 바뀌지
않는다. EC2 를 재시작해서 퍼블릭 IP 가 바뀌었다면:

```bash
# .env 의 VITE_SERVER_URL 을 새 주소로 수정한 뒤
npm run build
# dist/ 를 S3 등 배포 위치에 다시 업로드
```

개발 서버(`npm run dev`)도 `.env` 를 읽는 시점이 시작할 때이므로, 값을 바꿨으면
서버를 껐다 켜야 한다.

## 서버 주소가 비어 있으면

`VITE_SERVER_URL` 이 설정되지 않으면 화면에 "서버 주소(.env)가 설정되지 않았습니다"
안내가 뜨고 API 요청은 보내지 않는다.
