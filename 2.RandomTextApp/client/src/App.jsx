import { useCallback, useEffect, useState } from 'react';
import './App.css';
import QuoteCard from './components/QuoteCard.jsx';
import QuoteForm from './components/QuoteForm.jsx';
import QuoteLists from './components/QuoteLists.jsx';
import { loadSaved, persistSaved, loadTheme, persistTheme } from './lib/storage.js';

// 빌드 시점에 번들에 박히는 값이다. 주소가 바뀌면 다시 빌드해야 한다.
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const MAX_HISTORY = 8;
const THEME_ORDER = ['system', 'light', 'dark'];
const THEME_LABEL = { system: 'OS 설정', light: '라이트', dark: '다크' };

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
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [saved, setSaved] = useState(loadSaved);
  const [justSavedId, setJustSavedId] = useState(null);

  const [theme, setTheme] = useState(loadTheme);
  const [tier, setTier] = useState({ checked: false, server: false, db: false });
  const [isCheckingTier, setIsCheckingTier] = useState(false);

  // 테마: 'system' 이면 data-theme 를 지워 OS 선호(2계층)에 맡기고,
  // 그 외에는 data-theme 를 붙여 3계층이 이기게 한다.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    persistSaved(saved);
  }, [saved]);

  // "방금 저장됨" 하이라이트는 잠깐만 보여준다
  useEffect(() => {
    if (!justSavedId) return undefined;
    const timer = setTimeout(() => setJustSavedId(null), 4000);
    return () => clearTimeout(timer);
  }, [justSavedId]);

  const pushHistory = useCallback((item) => {
    setHistory((prev) => {
      const key = `${item.text}|${item.username}`;
      const rest = prev.filter((q) => `${q.text}|${q.username}` !== key);
      return [item, ...rest].slice(0, MAX_HISTORY);
    });
  }, []);

  const fetchQuote = useCallback(async () => {
    if (!SERVER_URL) return;

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${SERVER_URL}/api/text`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || data.error || `서버 응답 오류 (${res.status})`);
      }

      const next = { text: data.text, username: data.username };
      setQuote(next);
      pushHistory(next);
    } catch (err) {
      setQuote(null);
      setError(`명언을 불러오지 못했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [pushHistory]);

  // 티어 상태: GET / 응답에서 "연결 여부"만 읽는다.
  // 응답에는 DB 접속 설정값(비밀번호 포함)도 들어있지만 화면에는 절대 렌더링하지 않는다.
  const checkTier = useCallback(async () => {
    if (!SERVER_URL) return;

    setIsCheckingTier(true);
    try {
      const res = await fetch(`${SERVER_URL}/`);
      const data = await res.json().catch(() => ({}));
      setTier({
        checked: true,
        server: res.ok,
        db: data?.serverStatus?.dbConnection === '연결됨',
      });
    } catch {
      setTier({ checked: true, server: false, db: false });
    } finally {
      setIsCheckingTier(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
    checkTier();
  }, [fetchQuote, checkTier]);

  const handleSave = async ({ text, username }) => {
    if (!SERVER_URL) return false;

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

      // 브라우저 기록에도 남긴다. 서버가 붙이는 "...아마도..." 는 빼고 입력값 그대로 저장한다.
      const record = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        text,
        username,
        savedAt: new Date().toISOString(),
      };
      setSaved((prev) => [record, ...prev]);
      setJustSavedId(record.id);

      setNotice(data.message || '명언이 저장되었습니다');
      await fetchQuote();
      return true;
    } catch (err) {
      setError(`명언을 저장하지 못했습니다: ${err.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const cycleTheme = () => {
    setTheme((prev) => THEME_ORDER[(THEME_ORDER.indexOf(prev) + 1) % THEME_ORDER.length]);
  };

  const header = (
    <header className="page-header">
      <div className="page-header__bar">
        <p className="page-header__eyebrow">Random Quote</p>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={cycleTheme}
          aria-label={`테마 전환 (현재 ${THEME_LABEL[theme]})`}
        >
          테마: {THEME_LABEL[theme]}
        </button>
      </div>
      <h1 className="page-header__title">확신없는 랜덤 명언</h1>
    </header>
  );

  if (!SERVER_URL) {
    return (
      <div className="app">
        <div className="app__inner">
          {header}
          <section className="card stack">
            <div className="alert alert--error">
              <span className="alert__dot" />
              <span>서버 주소(.env)가 설정되지 않았습니다</span>
            </div>
            <p className="hint">
              <code>client/.env</code> 파일에 <code>VITE_SERVER_URL</code> 을 채운 뒤 개발
              서버를 다시 시작하거나 다시 빌드하세요.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__inner">
        {header}

        {/* 3티어 중 어디까지 연결됐는지 보여주는 인디케이터 */}
        <div className="tier">
          <span className={`tier__pill${tier.server ? ' is-ok' : ' is-down'}`}>
            <span className="tier__dot" />
            애플리케이션 서버 {tier.server ? '연결됨' : '연결 안 됨'}
          </span>
          <span className={`tier__pill${tier.db ? ' is-ok' : ' is-down'}`}>
            <span className="tier__dot" />
            데이터베이스 {tier.db ? '연결됨' : '연결 안 됨'}
          </span>
          <button
            type="button"
            className={`btn btn--ghost btn--sm${isCheckingTier ? ' is-busy' : ''}`}
            onClick={checkTier}
            disabled={isCheckingTier}
          >
            {isCheckingTier ? '확인 중...' : '상태 새로고침'}
          </button>
        </div>

        <QuoteCard quote={quote} isLoading={isLoading} error={error} />

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

        <QuoteForm onSubmit={handleSave} isSaving={isSaving} />

        <QuoteLists
          history={history}
          onPick={setQuote}
          saved={saved}
          justSavedId={justSavedId}
          onDelete={(id) => setSaved((prev) => prev.filter((item) => item.id !== id))}
          onClearAll={() => setSaved([])}
        />

        <p className="hint">저장한 명언 뒤에는 서버가 &ldquo;...아마도...&rdquo; 를 붙입니다.</p>
      </div>
    </div>
  );
}

export default App;
