// 화면 표시용 함수 모음. null 이면 '-' 를 돌려준다.

export function formatWon(value) {
  if (value === null) return '-'
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

export function formatPercent(value) {
  if (value === null) return '-'
  return `${Math.round(value)}%`
}

// 단계 비율 (소수 둘째 자리)
export function formatRate(value) {
  if (value === null) return '-'
  return `${value.toFixed(2)}%`
}

// 단계 숫자 (쉼표, 단위 없음)
export function formatCount(value) {
  return value.toLocaleString('ko-KR')
}

// 합계 카드 key → 표시 함수 (카드 · WoW 막대가 함께 쓴다)
export const CARD_FORMATTERS = {
  cost: formatWon,
  revenue: formatWon,
  roas: formatPercent,
  cpa: formatWon,
}
