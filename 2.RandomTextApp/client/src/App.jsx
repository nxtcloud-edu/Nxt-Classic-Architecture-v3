import { useCallback, useEffect, useState } from 'react';
import './App.css';

// 빌드 시점에 번들에 박히는 값이다. 주소가 바뀌면 다시 빌드해야 한다.
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function RefreshIcon() {
  return (
    <svg
      className="btn__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

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
      <div className="app">
        <div className="app__inner">
          <header className="page-header">
            <p className="page-header__eyebrow">Random Quote</p>
            <h1 className="page-header__title">확신없는 랜덤 명언</h1>
          </header>

          <section className="card stack">
            <div className="alert alert--error">
              <span className="alert__dot" />
              <span>서버 주소(.env)가 설정되지 않았습니다</span>
            </div>
            <p className="hint">
              <code>client/.env</code> 파일에 <code>VITE_SERVER_URL</code> 을 채운
              뒤 개발 서버를 다시 시작하거나 다시 빌드하세요.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__inner">
        <header className="page-header">
          <p className="page-header__eyebrow">Random Quote</p>
          <h1 className="page-header__title">확신없는 랜덤 명언</h1>
        </header>

        <section className="card" aria-live="polite" aria-busy={isLoading}>
          {isLoading && (
            <div className="skeleton">
              <div className="skeleton__line" />
              <div className="skeleton__line" />
              <div className="skeleton__line" />
            </div>
          )}

          {!isLoading && error && (
            <div className="alert alert--error">
              <span className="alert__dot" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !error && !quote && (
            <p className="empty">
              아직 저장된 명언이 없거나 서버와 연결되지 않았습니다.
            </p>
          )}

          {!isLoading && !error && quote && (
            <figure className="quote">
              <blockquote className="quote__text">{quote.text}</blockquote>
              <figcaption className="quote__by">
                <cite className="quote__cite">{quote.username}</cite>
              </figcaption>
            </figure>
          )}
        </section>

        <div className="actions">
          <button
            type="button"
            className={`btn btn--ghost${isLoading ? ' is-busy' : ''}`}
            onClick={fetchQuote}
            disabled={isLoading}
          >
            <RefreshIcon />
            {isLoading ? '불러오는 중...' : '새 명언 보기'}
          </button>
        </div>

        {notice && (
          <div className="alert alert--success">
            <span className="alert__dot" />
            <span>{notice}</span>
          </div>
        )}

        <section className="card">
          <form className="form" onSubmit={handleSubmit}>
            <h2 className="form__title">명언 남기기</h2>

            <div className="field">
              <label className="field__label" htmlFor="quote-text">
                명언
              </label>
              <input
                id="quote-text"
                className="field__input"
                type="text"
                placeholder="예: 오늘 할 일을 내일로 미루지 말자"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="quote-username">
                남긴 사람
              </label>
              <input
                id="quote-username"
                className="field__input"
                type="text"
                placeholder="예: 홍길동"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={isSaving}
            >
              {isSaving && <span className="spinner" />}
              {isSaving ? '저장 중...' : '명언 저장'}
            </button>
          </form>
        </section>

        <p className="hint">
          저장한 명언 뒤에는 서버가 &ldquo;...아마도...&rdquo; 를 붙입니다.
        </p>
      </div>
    </div>
  );
}

export default App;
