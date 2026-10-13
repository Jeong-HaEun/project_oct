// 퍼널 단계 흐름 (design.md 5-2 카드, 7절 모바일 세로 · 넓은 화면 가로)
// stages 4개 사이에 rates 3개를 끼워 그린다: 노출 → CTR → 클릭 → 담기율 → …
import { formatCount, formatRate } from '../utils/format.js'

export function FunnelFlow({ funnel, scopeLabel }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface p-4 md:p-5">
      <p className="text-xs text-muted">{scopeLabel} · 최근 7일</p>
      <ol className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        {funnel.stages.map((stage, index) => {
          const rate = index > 0 ? funnel.rates[index - 1] : null
          return (
            <li
              key={stage.key}
              className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4"
            >
              {rate && <FunnelRate rate={rate} />}
              <div>
                <p className="text-sm font-semibold text-muted">
                  {stage.label}
                </p>
                <p className="font-display text-xl font-extrabold tabular-nums text-ink md:text-3xl">
                  {formatCount(stage.count)}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// 앞 단계 → 뒤 단계 비율. 계산할 수 없으면 '-' (design.md 5-7 값이 없음)
function FunnelRate({ rate }) {
  const isEmpty = rate.value === null
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted">
      <span aria-hidden="true" className="md:hidden">
        ↓
      </span>
      <span aria-hidden="true" className="hidden md:inline">
        →
      </span>
      {rate.label}
      <span
        className={`text-sm font-semibold tabular-nums ${isEmpty ? 'text-muted' : 'text-ink'}`}
      >
        {formatRate(rate.value)}
      </span>
    </p>
  )
}
