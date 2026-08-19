// 테마 선택은 프레젠테이션 티어(브라우저)에만 남는다. 데이터 티어(RDS)와는 무관하다.
// 시크릿 모드나 저장 용량 초과 시 예외가 나므로 전부 try/catch 로 감싼다.

const THEME_KEY = 'aiNote.theme';

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
    // 저장 실패해도 화면 동작은 막지 않는다
  }
}
