const MAX_LENGTH = 500;

function NoteForm({ value, onChange, onSubmit, onClearAll, isSaving, hasNotes }) {
  const isOver = value.length > MAX_LENGTH;
  const canSubmit = Boolean(value.trim()) && !isOver && !isSaving;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div className="field">
        <div className="field__head">
          <label className="field__label" htmlFor="note-input">
            오늘 학습한 내용
          </label>
          <span className={`counter${isOver ? ' counter--over' : ''}`}>
            {value.length} / {MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="note-input"
          className="field__input field__input--area"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="무엇을 공부하셨나요? 기록해두면 AI가 다음에 배울 AWS 서비스를 추천해줍니다."
        />
      </div>

      <div className="actions">
        <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
          {isSaving && <span className="spinner" aria-hidden="true" />}
          {isSaving ? '추가하는 중...' : '학습 기록 추가'}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={onClearAll}
          disabled={!hasNotes}
        >
          전체 기록 삭제
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
