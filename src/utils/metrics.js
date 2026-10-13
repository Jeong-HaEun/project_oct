// 지표 계산 함수 모음. 계산할 수 없으면 null 을 돌려준다 ('-' 표시는 format.js).
import { countDays, filterByDateRange, getWeekRanges } from './dates.js'

const NUMBER_FIELDS = [
  'cost',
  'impressions',
  'clicks',
  'carts',
  'conversions',
  'revenue',
]

// 카드 순서와 "어느 쪽이 좋은지" (none = 판단하지 않음)
const CARDS = [
  { key: 'cost', title: '총 광고비', goodWhen: 'none' },
  { key: 'revenue', title: '총 매출', goodWhen: 'up' },
  { key: 'roas', title: '전체 ROAS', goodWhen: 'up' },
  { key: 'cpa', title: '전체 CPA', goodWhen: 'down' },
]

export function sumTotals(rows) {
  const totals = Object.fromEntries(NUMBER_FIELDS.map((field) => [field, 0]))
  for (const row of rows) {
    for (const field of NUMBER_FIELDS) totals[field] += row[field]
  }
  return totals
}

// 퍼센트 숫자로 돌려준다 (3.5 가 아니라 350)
export function calcRoas(revenue, cost) {
  if (cost === 0) return null
  return (revenue / cost) * 100
}

export function calcCpa(cost, conversions) {
  if (conversions === 0) return null
  return cost / conversions
}

export function compareChange(current, previous, goodWhen) {
  if (current === null || previous === null) return null
  if (current === previous) {
    return { direction: 'same', label: '변화 없음', tone: 'neutral' }
  }
  const direction = current > previous ? 'up' : 'down'
  if (goodWhen === 'none') return { direction, label: '변화', tone: 'neutral' }
  const isGood = direction === goodWhen
  return {
    direction,
    label: isGood ? '개선' : '악화',
    tone: isGood ? 'good' : 'bad',
  }
}

// 합계끼리 나눈다 (행별 지표의 평균 아님)
function cardValues(rows, range) {
  const totals = sumTotals(filterByDateRange(rows, range.start, range.end))
  return {
    cost: totals.cost,
    revenue: totals.revenue,
    roas: calcRoas(totals.revenue, totals.cost),
    cpa: calcCpa(totals.cost, totals.conversions),
  }
}

// 전주는 7일이 모두 있을 때만 비교한다
export function summarizeCards(rows, latestDate) {
  const { current, previous } = getWeekRanges(latestDate)
  const now = cardValues(rows, current)
  const hasFullPrevious = countDays(rows, previous.start, previous.end) === 7
  const before = hasFullPrevious ? cardValues(rows, previous) : null

  return CARDS.map(({ key, title, goodWhen }) => {
    const previousValue = before ? before[key] : null
    return {
      key,
      title,
      current: now[key],
      previous: previousValue,
      change: compareChange(now[key], previousValue, goodWhen),
    }
  })
}
