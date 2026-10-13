// 불러오는 중 (design.md 6절): 카드 자리에 회색 막대 + 안내 문구
import { CARD_GRID } from './SummaryCard.jsx'

export function LoadingState() {
  return (
    <div className="mt-6 md:mt-8">
      <p role="status" className="text-sm text-muted">
        서버를 깨우는 중이에요. 최대 1분 걸릴 수 있어요
      </p>
      <div className={`mt-3 ${CARD_GRID}`}>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-28 animate-pulse rounded bg-hairline" />
        ))}
      </div>
    </div>
  )
}
