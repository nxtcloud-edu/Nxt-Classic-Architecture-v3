// App.jsx
import { useState, useEffect, useCallback } from 'react';
import './App.css';
import NoteCard from './components/NoteCard.jsx';
import { loadTheme, persistTheme } from './lib/storage.js';

// 빌드 시점에 번들에 박히는 값이다. 주소가 바뀌면 다시 빌드해야 한다.
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const THEME_ORDER = ['system', 'light', 'dark'];
const THEME_LABEL = { system: 'OS 설정', light: '라이트', dark: '다크' };

// 응답 본문에 서버가 담아 보낸 에러 메시지가 있으면 그것을 쓴다
const readError = async (response) => {
  try {
    const data = await response.json();
    return data.message || data.error || `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
};

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // AI 응답을 기다리는 중인 노트 id 목록
  const [pendingAiIds, setPendingAiIds] = useState([]);
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
    if (!SERVER_URL) return;

    try {
      setError(null);
      const response = await fetch(`${SERVER_URL}/notes`);

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = await response.json();

      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setNotes(data);
        // AI 응답이 도착했거나 삭제된 노트는 대기 목록에서 뺀다
        setPendingAiIds((prev) =>
          prev.filter((id) => {
            const note = data.find((item) => item.id === id);
            return note && !note.ai_note;
          }),
        );
      } else {
        console.error('서버에서 배열이 아닌 데이터를 받았습니다:', data);
        setNotes([]);
        setError('서버에서 올바르지 않은 데이터 형식을 받았습니다.');
      }
    } catch (error) {
      console.error('노트 조회 중 오류 발생:', error);
      setNotes([]); // 오류 시 빈 배열로 설정
      setError(`노트를 불러올 수 없습니다: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    if (!SERVER_URL) return undefined;

    fetchNotes();
    // AI 분석은 서버에서 비동기로 진행되므로 주기적으로 결과를 확인한다
    const interval = setInterval(fetchNotes, 10000);
    return () => clearInterval(interval);
  }, [fetchNotes]);

  const addNote = async () => {
    if (!newNote.trim() || !SERVER_URL) return;

    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${SERVER_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = await response.json();
      if (data?.id && data.ai_status !== 'unavailable') {
        setPendingAiIds((prev) => [...prev, data.id]);
      }

      setNewNote('');
      await fetchNotes();
    } catch (error) {
      console.error('노트 추가 중 오류 발생:', error);
      setError(`노트를 저장할 수 없습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!SERVER_URL) return;

    try {
      setError(null);
      const response = await fetch(`${SERVER_URL}/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await fetchNotes();
    } catch (error) {
      console.error('노트 삭제 중 오류 발생:', error);
      setError(`노트를 삭제할 수 없습니다: ${error.message}`);
    }
  };

  const deleteNotes = async () => {
    if (!SERVER_URL) return;
    if (!window.confirm('모든 기록을 삭제하시겠습니까?')) return;

    try {
      setError(null);
      const response = await fetch(`${SERVER_URL}/notes`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await fetchNotes();
    } catch (error) {
      console.error('전체 노트 삭제 중 오류 발생:', error);
      setError(`전체 기록을 삭제할 수 없습니다: ${error.message}`);
    }
  };

  const requestAIAdvice = async (id) => {
    if (!SERVER_URL) return;

    setPendingAiIds((prev) => [...prev, id]);
    try {
      setError(null);
      const response = await fetch(`${SERVER_URL}/ainotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await fetchNotes();
    } catch (error) {
      console.error('AI 조언 요청 중 오류 발생:', error);
      setError(`AI 조언을 받을 수 없습니다: ${error.message}`);
      setPendingAiIds((prev) => prev.filter((pendingId) => pendingId !== id));
    }
  };

  const cycleTheme = () => {
    setTheme((prev) => THEME_ORDER[(THEME_ORDER.indexOf(prev) + 1) % THEME_ORDER.length]);
  };

  const header = (
    <header className="page-header">
      <div className="page-header__bar">
        <p className="page-header__eyebrow">AI Study Notes</p>
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
        오늘 배운 내용을 남기면 Gemini 가 이어서 배울 AWS 서비스를 추천합니다.
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
          <div className="alert alert--error" role="alert">
            <span className="alert__dot" />
            <span>{error}</span>
          </div>
        )}

        <section className="card">
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              addNote();
            }}
          >
            <div className="field">
              <div className="field__head">
                <label className="field__label" htmlFor="note-input">
                  오늘 학습한 내용
                </label>
                <span className="counter">{newNote.length}자</span>
              </div>
              <textarea
                id="note-input"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="무엇을 공부하셨나요?"
                className="field__input field__input--area"
              />
            </div>

            <div className="actions actions--end">
              <button
                type="button"
                onClick={deleteNotes}
                className="btn btn--danger"
                disabled={notes.length === 0}
              >
                전체 기록 삭제
              </button>
              <button
                type="submit"
                disabled={isLoading || !newNote.trim()}
                className="btn btn--primary"
              >
                {isLoading ? '추가 중...' : '학습 기록 추가'}
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">내 학습 기록</h2>
            <span className="panel__count">{notes.length}개</span>
          </div>

          {notes.length === 0 ? (
            <div className="empty">
              <p className="empty__title">아직 기록된 학습 내용이 없습니다</p>
              <p className="empty__text">
                위에 오늘 공부한 내용을 적고 저장하면 여기에 쌓입니다.
              </p>
            </div>
          ) : (
            <ul className="notes">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isPending={pendingAiIds.includes(note.id)}
                  onRequestAdvice={() => requestAIAdvice(note.id)}
                  onDelete={() => deleteNote(note.id)}
                />
              ))}
            </ul>
          )}
        </section>

        <p className="hint">
          AI 분석은 노트가 저장된 뒤 백그라운드에서 진행되며, 화면은 10초마다 자동으로
          결과를 확인합니다.
        </p>
      </div>
    </div>
  );
}

export default App;
