// 데이터 기준일 + 업로드 지연 경고 (design.md 5-6, spec 결정 1). action 은 오른쪽 끝 (98일 내려받기 버튼)
import { formatShortDate } from '../utils/dates.js'

export function DataDateBar({ latestDate, delayDays, action = null }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <p className="text-xs text-muted">
        데이터 기준일 {formatShortDate(latestDate)}
      </p>
      {delayDays > 0 && (
        <p className="rounded bg-bad-tint px-2 py-1 text-xs font-semibold text-bad">
          ⚠ {delayDays}일간 업로드 없음
        </p>
      )}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  )
}
