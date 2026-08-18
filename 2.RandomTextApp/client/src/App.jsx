import { useCallback, useEffect, useState } from 'react';
import './App.css';

// 빌드 시점에 번들에 박히는 값이다. 주소가 바뀌면 다시 빌드해야 한다.
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function App() {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fetchQuote = useCallback(async () => {
    if (!SERVER_URL) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${SERVER_URL}/api/text`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.message || data.error || `서버 응답 오류 (${res.status})`,
        );
      }

      setQuote({ text: data.text, username: data.username });
    } catch (err) {
      setQuote(null);
      setError(`명언을 불러오지 못했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!SERVER_URL || isSaving) return;

    setIsSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch(`${SERVER_URL}/api/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, username }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `서버 응답 오류 (${res.status})`);
      }

      setNotice(data.message || '명언이 저장되었습니다');
      setText('');
      setUsername('');
      await fetchQuote();
    } catch (err) {
      setError(`명언을 저장하지 못했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!SERVER_URL) {
    return (
      <div className="App">
        <h1>확신없는 랜덤 명언</h1>
        <p className="message message-error">
          서버 주소(.env)가 설정되지 않았습니다
        </p>
        <p className="message">
          client/.env 파일에 VITE_SERVER_URL 을 채운 뒤 개발 서버를 다시
          시작하거나 다시 빌드하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>확신없는 랜덤 명언</h1>

      {isLoading && <p className="message">명언을 불러오는 중...</p>}
      {!isLoading && error && <p className="message message-error">{error}</p>}
      {!isLoading && !error && !quote && (
        <p className="message">
          아직 저장된 명언이 없거나 서버와 연결되지 않았습니다.
        </p>
      )}
      {!isLoading && !error && quote && (
        <figure className="quote">
          <blockquote>{quote.text}</blockquote>
          <figcaption>
            by <cite>{quote.username}</cite>
          </figcaption>
        </figure>
      )}

      <button
        type="button"
        className="refresh-button"
        onClick={fetchQuote}
        disabled={isLoading}
      >
        {isLoading ? '불러오는 중...' : '새 명언 보기'}
      </button>

      {notice && <p className="message message-success">{notice}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" disabled={isSaving}>
          {isSaving ? '저장 중...' : '명언 저장'}
        </button>
      </form>
    </div>
  );
}

export default App;
