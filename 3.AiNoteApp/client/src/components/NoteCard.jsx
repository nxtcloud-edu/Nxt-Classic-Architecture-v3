import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 넓은 표가 카드를 밀어내지 않도록 스크롤 컨테이너로 감싼다
const markdownComponents = {
  table: (props) => (
    <div className="markdown__scroll">
      <table {...props} />
    </div>
  ),
};

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function NoteCard({ note, isPending, onRequestAdvice, onDelete }) {
  const savedAt = formatDate(note.created_at);

  return (
    <li className="note card">
      <div className="note__head">
        <span className="note__label">학습 내용</span>
        {savedAt && <time className="note__time">{savedAt}</time>}
      </div>

      <p className="note__text">{note.user_note}</p>

      {note.ai_note && (
        <div className="ai">
          <div className="ai__head">
            <span className="ai__badge">Gemini</span>
            <span className="ai__title">이어서 배우면 좋은 AWS 서비스</span>
          </div>
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {note.ai_note}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {!note.ai_note && isPending && (
        <div className="ai ai--pending" aria-live="polite">
          <div className="ai__head">
            <span className="ai__badge">Gemini</span>
            <span className="ai__title">분석 중</span>
            <span className="dots" aria-hidden="true">
              <span className="dots__dot" />
              <span className="dots__dot" />
              <span className="dots__dot" />
            </span>
          </div>
          <div className="skeleton" aria-hidden="true">
            <div className="skeleton__line" />
            <div className="skeleton__line" />
            <div className="skeleton__line" />
          </div>
          <span className="sr-only">AI 가 학습 내용을 분석하고 있습니다</span>
        </div>
      )}

      <div className="note__actions">
        {!note.ai_note && !isPending && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onRequestAdvice}>
            Gemini 조언 요청
          </button>
        )}
        <span className="actions__spacer" />
        <button type="button" className="btn btn--danger btn--sm" onClick={onDelete}>
          삭제
        </button>
      </div>
    </li>
  );
}

export default NoteCard;
