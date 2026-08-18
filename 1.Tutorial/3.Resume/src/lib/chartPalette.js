/**
 * 차트 팔레트.
 *
 * 카테고리 색은 슬롯 순서대로 고정 배정한다(순환 금지). 라이트/다크는 같은 색상의
 * 서로 다른 단계이며, 각 모드의 표면색 기준으로 검증된 값이다.
 * 텍스트(축·레이블·범례)는 시리즈 색이 아니라 잉크 토큰을 쓴다.
 */
const palette = {
  light: {
    series: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
    surface: '#FAFAFA', // 차트가 놓이는 페이지 배경 — 마크 사이 간격 링에 쓴다
    card: '#FFFFFF', // 툴팁처럼 떠 있는 면
    grid: '#E4E4E7',
    axis: '#71717A',
  },
  dark: {
    series: ['#3987e5', '#d95926', '#199e70', '#c98500'],
    surface: '#09090B',
    card: '#18181B',
    grid: '#27272A',
    axis: '#8B8B93',
  },
};

export function chartTheme(darkMode) {
  return darkMode ? palette.dark : palette.light;
}
