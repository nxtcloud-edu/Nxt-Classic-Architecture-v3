import { useState } from 'react';

// 서버는 길이를 검사하지 않는다. 여기 제한은 순전히 클라이언트 안내용이다.
// username 255 는 db.sql 의 VARCHAR(255) 와 맞춘 값이다.
const MAX_TEXT = 200;
const MAX_USERNAME = 255;

export default function QuoteForm({ onSubmit, isSaving }) {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');

  const textOver = text.length > MAX_TEXT;
  const usernameOver = username.length > MAX_USERNAME;
  const isEmpty = !text.trim() || !username.trim();
  const canSubmit = !isEmpty && !textOver && !usernameOver && !isSaving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const ok = await onSubmit({ text: text.trim(), username: username.trim() });
    if (ok) {
      setText('');
      setUsername('');
    }
  };

  return (
    <section className="card">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <h2 className="form__title">명언 남기기</h2>

        <div className="field">
          <div className="field__head">
            <label className="field__label" htmlFor="quote-text">
              명언
            </label>
            <span className={`counter${textOver ? ' counter--over' : ''}`}>
              {text.length} / {MAX_TEXT}
            </span>
          </div>
          <input
            id="quote-text"
            className="field__input"
            type="text"
            placeholder="예: 오늘 할 일을 내일로 미루지 말자"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={textOver}
          />
          {textOver && (
            <p className="field__error">
              명언은 {MAX_TEXT}자 이내로 적어주세요. 지금 {text.length - MAX_TEXT}자
              넘었습니다.
            </p>
          )}
        </div>

        <div className="field">
          <div className="field__head">
            <label className="field__label" htmlFor="quote-username">
              남긴 사람
            </label>
            <span className={`counter${usernameOver ? ' counter--over' : ''}`}>
              {username.length} / {MAX_USERNAME}
            </span>
          </div>
          <input
            id="quote-username"
            className="field__input"
            type="text"
            placeholder="예: 홍길동"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={usernameOver}
          />
          {usernameOver && (
            <p className="field__error">
              이름은 {MAX_USERNAME}자까지만 저장됩니다(DB 컬럼 길이).
            </p>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={!canSubmit}>
          {isSaving && <span className="spinner" />}
          {isSaving ? '저장 중...' : '명언 저장'}
        </button>

        {isEmpty && !isSaving && (
          <p className="hint">명언과 남긴 사람을 모두 입력하면 저장할 수 있습니다.</p>
        )}
      </form>
    </section>
  );
}
