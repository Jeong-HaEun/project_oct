// 요약 페이지 (/). 계산은 utils 함수를 부르기만 한다.
import { DataDateBar } from '../components/DataDateBar.jsx'
import { CARD_GRID, SummaryCard } from '../components/SummaryCard.jsx'
import {
  getLatestDate,
  getTodayKst,
  getUploadDelayDays,
} from '../utils/dates.js'
import { summarizeCards } from '../utils/metrics.js'

export function SummaryPage({ rows }) {
  const latestDate = getLatestDate(rows)

  // 임시: 빈 데이터 화면(버튼 포함)은 이슈 8 에서 만든다
  if (latestDate === null) {
    return <p className="mt-6 text-sm text-ink md:mt-8">아직 데이터가 없어요</p>
  }

  const cards = summarizeCards(rows, latestDate)
  const delayDays = getUploadDelayDays(latestDate, getTodayKst())

  return (
    <>
      <DataDateBar latestDate={latestDate} delayDays={delayDays} />
      <section aria-label="최근 7일 합계" className={`mt-3 ${CARD_GRID}`}>
        {cards.map((card) => (
          <SummaryCard key={card.key} card={card} />
        ))}
      </section>
    </>
  )
}
