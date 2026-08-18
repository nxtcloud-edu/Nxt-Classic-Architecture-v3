// App.jsx
import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // AI 응답을 기다리는 중인 노트 id 목록
  const [pendingAiIds, setPendingAiIds] = useState([]);

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
        console.error("서버에서 배열이 아닌 데이터를 받았습니다:", data);
        setNotes([]);
        setError("서버에서 올바르지 않은 데이터 형식을 받았습니다.");
      }
    } catch (error) {
      console.error("노트 조회 중 오류 발생:", error);
      setNotes([]); // 오류 시 빈 배열로 설정
      setError(`노트를 불러올 수 없습니다: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    if (!SERVER_URL) return;

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = await response.json();
      if (data?.id && data.ai_status !== "unavailable") {
        setPendingAiIds((prev) => [...prev, data.id]);
      }

      setNewNote("");
      await fetchNotes();
    } catch (error) {
      console.error("노트 추가 중 오류 발생:", error);
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
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await fetchNotes();
    } catch (error) {
      console.error("노트 삭제 중 오류 발생:", error);
      setError(`노트를 삭제할 수 없습니다: ${error.message}`);
    }
  };

  const deleteNotes = async () => {
    if (!SERVER_URL) return;
    if (!window.confirm("모든 기록을 삭제하시겠습니까?")) return;

    try {
      setError(null);
      const response = await fetch(`${SERVER_URL}/notes`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await fetchNotes();
    } catch (error) {
      console.error("전체 노트 삭제 중 오류 발생:", error);
      setError(`전체 기록을 삭제할 수 없습니다: ${error.message}`);
    }
  };

  const requestAIAdvice = async (id) => {
    if (!SERVER_URL) return;

    setPendingAiIds((prev) => [...prev, id]);
    try {
      setError(null);
      const response = await fetch(`${SERVER_URL}/ainotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      await fetchNotes();
    } catch (error) {
      console.error("AI 조언 요청 중 오류 발생:", error);
      setError(`AI 조언을 받을 수 없습니다: ${error.message}`);
      setPendingAiIds((prev) => prev.filter((pendingId) => pendingId !== id));
    }
  };

  if (!SERVER_URL) {
    return (
      <div className="App">
        <div className="container">
          <h1>학습 기록 애플리케이션</h1>
          <div className="error-banner">
            <strong>서버 주소가 설정되지 않았습니다.</strong>
            <p>
              <code>client/.env</code> 파일에 <code>VITE_SERVER_URL</code>을 지정한 뒤 다시
              빌드하거나 개발 서버를 재시작하세요. (예: <code>VITE_SERVER_URL=http://localhost</code>)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <h1>학습 기록 애플리케이션</h1>
        <h3>오늘 학습한 내용을 기록해보세요.</h3>

        {error && (
          <div className="error-banner" role="alert">
            <strong>⚠️ 오류</strong>
            <p>{error}</p>
          </div>
        )}

        <div className="input-section">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="무엇을 공부하셨나요?"
            className="note-input"
          />
          <div className="button-group">
            <button
              onClick={addNote}
              disabled={isLoading || !newNote.trim()}
              className="primary-button"
            >
              {isLoading ? "추가 중..." : "학습 기록 추가"}
            </button>
            <button onClick={deleteNotes} className="danger-button">
              전체 기록 삭제
            </button>
          </div>
        </div>

        <h2>내 학습 기록</h2>
        <div className="notes-container">
          {notes.length === 0 ? (
            <p className="no-notes">아직 기록된 학습 내용이 없습니다.</p>
          ) : (
            notes.map((note) => {
              const isPending = pendingAiIds.includes(note.id);

              return (
                <div key={note.id} className="note">
                  <div className="note-content">
                    <strong>📝 학습 내용:</strong>
                    <p>{note.user_note}</p>
                  </div>

                  {note.ai_note && (
                    <div className="ai-note">
                      <strong>🤖 Gemini 추천 학습:</strong>
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {note.ai_note}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {!note.ai_note && isPending && (
                    <div className="ai-note ai-pending">
                      <strong>🤖 Gemini 추천 학습:</strong>
                      <p>AI 분석 중...</p>
                    </div>
                  )}

                  <div className="note-actions">
                    {!note.ai_note && !isPending && (
                      <button
                        onClick={() => requestAIAdvice(note.id)}
                        className="secondary-button"
                      >
                        Gemini 조언 요청
                      </button>
                    )}
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="danger-button"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
