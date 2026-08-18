/** @type {import('tailwindcss').Config} */
export default {
  // 다크 모드는 <html>의 .dark 클래스로 켠다 (App의 darkMode state가 붙인다)
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Crimson Pro"', 'Georgia', 'serif'],
        body: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
      },
      // 시맨틱 토큰. 실제 값은 index.css의 :root / .dark 에서 정의한다.
      colors: {
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        faint: 'var(--color-faint)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        line: 'var(--color-line)',
      },
    },
  },
  plugins: [],
};
