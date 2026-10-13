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
// eslint-disable-next-line no-unused-vars -- 스텁: Green 단계에서 지운다
export function formatRate(value) {
  throw new Error('not implemented')
}

// 단계 숫자 (쉼표, 단위 없음)
// eslint-disable-next-line no-unused-vars -- 스텁: Green 단계에서 지운다
export function formatCount(value) {
  throw new Error('not implemented')
}
