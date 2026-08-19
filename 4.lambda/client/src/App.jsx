import { useCallback, useEffect, useState } from 'react';
import './App.css';
import NoteCard from './components/NoteCard.jsx';
import NoteForm from './components/NoteForm.jsx';
import { loadTheme, persistTheme } from './lib/storage.js';

// 빌드 시점에 번들에 박히는 값이다. 주소가 바뀌면 다시 빌드해야 한다.
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const POLL_INTERVAL = 10000;
const THEME_ORDER = ['system', 'light', 'dark'];
const THEME_LABEL = { system: 'OS 설정', light: '라이트', dark: '다크' };

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  // 노트 단위 AI 요청 상태: { [noteId]: "gemini" | "nova" }
  const [pendingAi, setPendingAi] = useState({});
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(loadTheme);

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

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/notes`);

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('서버에서 배열이 아닌 데이터를 받았습니다');
      }

      setNotes(data);
      setError('');
      // AI 응답은 Lambda가 DB에 쓴다. 폴링으로 도착한 노트에 ai_note가 생겼으면 대기 상태를 푼다.
      setPendingAi((prev) => {
        const next = {};
        Object.entries(prev).forEach(([id, type]) => {
          const note = data.find((item) => String(item.id) === id);
          if (note && !note.ai_note) {
            next[id] = type;
          }
        });
        return next;
      });
    } catch (err) {
      // 목록은 그대로 두고 배너로만 알린다 (일시적 오류로 화면이 비지 않도록)
      console.error('노트 조회 중 오류 발생:', err);
      setError(`노트를 불러오지 못했습니다: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    if (!SERVER_URL) return undefined;

    fetchNotes();
    const interval = setInterval(fetchNotes, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotes]);

  const addNote = async () => {
    if (!newNote.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${SERVER_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      setNewNote('');
      await fetchNotes();
    } catch (err) {
      console.error('노트 추가 중 오류 발생:', err);
      setError(`노트 추가에 실패했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${SERVER_URL}/notes/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      await fetchNotes();
    } catch (err) {
      console.error('노트 삭제 중 오류 발생:', err);
      setError(`노트 삭제에 실패했습니다: ${err.message}`);
    }
  };

  const deleteAllNotes = async () => {
    if (!window.confirm('모든 기록을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${SERVER_URL}/notes`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      await fetchNotes();
    } catch (err) {
      console.error('전체 노트 삭제 중 오류 발생:', err);
      setError(`전체 삭제에 실패했습니다: ${err.message}`);
    }
  };

  // AI 조언 요청. 서버는 Lambda 호출만 하고 DB 저장은 Lambda가 하므로,
  // 응답이 와도 곧바로 결과가 보이지 않는다. 폴링이 결과를 가져올 때까지 대기 상태를 유지한다.
  const requestAiAdvice = async (userNote, noteId, aiType) => {
    if (pendingAi[noteId]) return;

    const endpoint = aiType === 'gemini' ? '/gemini-notes' : '/nova-notes';
    const label = aiType === 'gemini' ? 'Gemini' : 'Nova';

    setPendingAi((prev) => ({ ...prev, [noteId]: aiType }));
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userNote, noteId }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      await fetchNotes();
    } catch (err) {
      console.error(`${label} 조언 요청 중 오류 발생:`, err);
      setError(`${label} 조언 요청에 실패했습니다: ${err.message}`);
      setPendingAi((prev) => {
        const next = { ...prev };
        delete next[noteId];
        return next;
      });
    }
  };

  const cycleTheme = () => {
    setTheme((prev) => THEME_ORDER[(THEME_ORDER.indexOf(prev) + 1) % THEME_ORDER.length]);
  };

  const header = (
    <header className="page-header">
      <div className="page-header__bar">
        <p className="page-header__eyebrow">Serverless AI Notes</p>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={cycleTheme}
          aria-label={`테마 전환 (현재 ${THEME_LABEL[theme]})`}
        >
          테마: {THEME_LABEL[theme]}
        </button>
      </div>
      <h1 className="page-header__title">AI 학습 노트</h1>
      <p className="page-header__sub">
        오늘 배운 내용을 남기면 Lambda 위의 AI가 다음에 배울 AWS 서비스를 추천합니다.
      </p>
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

        {error && (
          <div className="alert alert--error" role="status">
            <span className="alert__dot" />
            <span>{error}</span>
          </div>
        )}

        <NoteForm
          value={newNote}
          onChange={setNewNote}
          onSubmit={addNote}
          onClearAll={deleteAllNotes}
          isSaving={isSaving}
          hasNotes={notes.length > 0}
        />

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">내 학습 기록</h2>
            <span className="panel__count">{notes.length}개</span>
          </div>

          {notes.length === 0 ? (
            <div className="empty">
              <p className="empty__title">아직 기록된 학습 내용이 없습니다</p>
              <p className="empty__text">
                위에 오늘 배운 내용을 적고 &lsquo;학습 기록 추가&rsquo;를 눌러보세요.
              </p>
            </div>
          ) : (
            <ul className="notes">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  pendingType={pendingAi[note.id]}
                  onRequestAi={requestAiAdvice}
                  onDelete={deleteNote}
                />
              ))}
            </ul>
          )}
        </section>

        <p className="hint">
          AI 응답은 EC2가 아니라 Lambda가 직접 DB에 저장합니다. 그래서 버튼을 눌러도 결과가
          바로 뜨지 않고, 10초 주기 폴링이 가져올 때 화면에 나타납니다.
        </p>
      </div>
    </div>
  );
}

export default App;
