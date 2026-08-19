// localStorage 는 "이 브라우저"에만 남는 프레젠테이션 티어의 저장소다.
// 데이터 티어(RDS)와는 완전히 별개라는 점을 수업에서 강조하기 위한 모듈이다.
// 시크릿 모드나 저장 용량 초과 시 예외가 나므로 전부 try/catch 로 감싼다.

const SAVED_KEY = 'randomQuote.saved';
const THEME_KEY = 'randomQuote.theme';

export function loadSaved() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSaved(list) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  } catch {
    // 저장 실패해도 화면 동작은 막지 않는다
  }
}

export function loadTheme() {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === 'light' || theme === 'dark' ? theme : 'system';
  } catch {
    return 'system';
  }
}

export function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // 무시
  }
}
