// 액센트는 인디고 1색으로 통일하고, AI 종류는 이모지와 배지로만 구분한다.
const AI_OPTIONS = [
  { type: 'gemini', emoji: '🤖', label: 'Gemini' },
  { type: 'nova', emoji: '🌟', label: 'Nova' },
];

const AI_INFO = {
  gemini: { emoji: '🤖', label: 'Gemini' },
  nova: { emoji: '🌟', label: 'Nova' },
};

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function NoteCard({ note, pendingType, onRequestAi, onDelete }) {
  const aiInfo = AI_INFO[note.ai_type] ?? { emoji: '✨', label: 'AI' };
  const isPending = Boolean(pendingType);
  const createdAt = formatDate(note.created_at);

  return (
    <li className="note">
      <div className="note__body">
        <span className="note__label">학습 내용</span>
        <p className="note__text">{note.user_note}</p>
      </div>

      {note.ai_note && (
        <div className="note__ai">
          <span className="badge">
            <span className="badge__emoji" aria-hidden="true">
              {aiInfo.emoji}
            </span>
            {aiInfo.label} 추천 학습
          </span>
          <p className="note__ai-text">{note.ai_note}</p>
        </div>
      )}

      {isPending && (
        <div className="note__waiting">
          <span className="dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            {AI_INFO[pendingType].emoji} {AI_INFO[pendingType].label}가 분석 중입니다
          </span>
          <span className="note__waiting-note">최대 10초 후 표시됩니다</span>
        </div>
      )}

      <div className="note__actions">
        {!note.ai_note && (
          <div className="note__ai-buttons">
            {AI_OPTIONS.map(({ type, emoji, label }) => {
              const isThisPending = pendingType === type;
              return (
                <button
                  key={type}
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => onRequestAi(note.user_note, note.id, type)}
                  disabled={isPending}
                >
                  {isThisPending ? (
                    <span className="spinner" aria-hidden="true" />
                  ) : (
                    <span className="btn__emoji" aria-hidden="true">
                      {emoji}
                    </span>
                  )}
                  {isThisPending ? '분석 중...' : `${label} 조언 요청`}
                </button>
              );
            })}
          </div>
        )}

        <div className="note__actions-end">
          {createdAt && <span className="note__meta">{createdAt}</span>}
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(note.id)}
            disabled={isPending}
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}

export default NoteCard;
