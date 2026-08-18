// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // 노트 단위 AI 요청 상태: { [noteId]: "gemini" | "nova" }
  const [pendingAi, setPendingAi] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!SERVER_URL) return;

    fetchNotes();
    const interval = setInterval(fetchNotes, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/notes`);

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("서버에서 배열이 아닌 데이터를 받았습니다");
      }

      setNotes(data);
      setError(null);
      // AI 응답은 Lambda가 DB에 쓴다. 폴링으로 도착한 노트에 ai_note가 생겼으면 대기 상태를 푼다.
      setPendingAi((prev) => {
        const next = {};
        Object.entries(prev).forEach(([id, type]) => {
          const note = data.find((n) => String(n.id) === id);
          if (note && !note.ai_note) {
            next[id] = type;
          }
        });
        return next;
      });
    } catch (err) {
      // 목록은 그대로 두고 배너로만 알린다 (일시적 오류로 화면이 비지 않도록)
      console.error("노트 조회 중 오류 발생:", err);
      setError(`노트를 불러오지 못했습니다: ${err.message}`);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      setNewNote("");
      await fetchNotes();
    } catch (err) {
      console.error("노트 추가 중 오류 발생:", err);
      setError(`노트 추가에 실패했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${SERVER_URL}/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      await fetchNotes();
    } catch (err) {
      console.error("노트 삭제 중 오류 발생:", err);
      setError(`노트 삭제에 실패했습니다: ${err.message}`);
    }
  };

  const deleteNotes = async () => {
    if (!window.confirm("모든 기록을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`${SERVER_URL}/notes`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      await fetchNotes();
    } catch (err) {
      console.error("전체 노트 삭제 중 오류 발생:", err);
      setError(`전체 삭제에 실패했습니다: ${err.message}`);
    }
  };

  // AI 조언 요청. 서버는 Lambda 호출만 하고 DB 저장은 Lambda가 하므로,
  // 응답이 와도 곧바로 결과가 보이지 않는다. 폴링이 결과를 가져올 때까지 대기 상태를 유지한다.
  const requestAiAdvice = async (userNote, noteId, aiType) => {
    if (pendingAi[noteId]) return;

    const endpoint = aiType === "gemini" ? "/gemini-notes" : "/nova-notes";
    const label = aiType === "gemini" ? "Gemini" : "Nova";

    setPendingAi((prev) => ({ ...prev, [noteId]: aiType }));
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: userNote,
          noteId: noteId,
        }),
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

  // AI 타입에 따른 아이콘과 텍스트 반환
  const getAIDisplayInfo = (aiType) => {
    switch (aiType) {
      case "gemini":
        return { icon: "🤖", label: "Gemini 추천 학습:" };
      case "nova":
        return { icon: "🌟", label: "Nova 추천 학습 서비스:" };
      default:
        return { icon: "🤖", label: "Gemini 추천 학습 서비스:" };
    }
  };

  if (!SERVER_URL) {
    return (
      <div className="App">
        <div className="container">
          <h1>학습 기록 애플리케이션</h1>
          <div className="error-banner">
            <strong>환경변수가 설정되지 않았습니다.</strong>
            <p>
              client 디렉토리에 <code>.env</code> 파일을 만들고
              <code> VITE_SERVER_URL=http://EC2-주소</code> 를 채운 뒤 개발 서버를
              다시 시작하세요. (<code>.env.example</code> 참고)
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
          <div className="error-banner">
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
              const aiInfo = getAIDisplayInfo(note.ai_type);
              const pendingType = pendingAi[note.id];

              return (
                <div key={note.id} className="note">
                  <div className="note-content">
                    <strong>📝 학습 내용:</strong>
                    <p>{note.user_note}</p>
                  </div>

                  {note.ai_note && (
                    <div className="ai-note">
                      <strong>
                        {aiInfo.icon} {aiInfo.label}
                      </strong>
                      <p>{note.ai_note}</p>
                    </div>
                  )}

                  <div className="note-actions">
                    {!note.ai_note && !pendingType && (
                      <div className="ai-buttons">
                        <button
                          onClick={() =>
                            requestAiAdvice(note.user_note, note.id, "gemini")
                          }
                          className="secondary-button"
                        >
                          Gemini 조언 요청
                        </button>
                        <button
                          onClick={() =>
                            requestAiAdvice(note.user_note, note.id, "nova")
                          }
                          className="secondary-button"
                        >
                          Nova 조언 요청
                        </button>
                      </div>
                    )}

                    {pendingType && (
                      <div className="loading-state">
                        <span>
                          {pendingType === "gemini" ? "🤖 Gemini" : "🌟 Nova"}가
                          분석 중입니다... (최대 10초 후 표시됩니다)
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="danger-button"
                      disabled={Boolean(pendingType)}
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
