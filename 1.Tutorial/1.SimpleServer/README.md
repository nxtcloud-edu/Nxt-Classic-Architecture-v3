# 1.SimpleServer

서버가 무엇인지 감을 잡는 첫 실습이다. 같은 "웹 서버"를 Node.js와 Python(Streamlit) 두 가지로 각각 띄워 본다.

## Node.js HTTP 서버

`server.js`는 표준 라이브러리 `http`만 사용한다. 별도 의존성이 없으므로 `npm install` 없이 바로 실행된다.

```bash
npm start          # 또는: node server.js
```

브라우저에서 http://localhost:8080 접속.

포트와 표시 이름은 환경 변수로 바꿀 수 있다.

```bash
PORT=3000 USERNAME=glen npm start
```

## Streamlit 앱

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py
```

브라우저가 자동으로 http://localhost:8501 을 연다.

`pages/` 디렉터리의 파일은 Streamlit 멀티페이지 기능으로 사이드바에 자동 등록된다. `app.py`만 실행하면 `pages/ai_policy_researcher.py`도 함께 뜬다.
