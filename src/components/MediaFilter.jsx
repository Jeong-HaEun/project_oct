// 매체 필터 알약 (design.md 5-4). media 가 null 이면 "전체" 가 골라진 상태.
import { MEDIA_LIST } from '../utils/media.js'

const OPTIONS = [{ value: null, label: '전체' }].concat(
  MEDIA_LIST.map((media) => ({ value: media, label: media })),
)

export function MediaFilter({ media, onChange }) {
  return (
    <div
      role="group"
      aria-label="매체 필터"
      className="mt-6 flex gap-2 md:mt-8"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.label}
          type="button"
          aria-pressed={media === option.value}
          onClick={() => onChange(option.value)}
          className="h-9 whitespace-nowrap rounded-full border border-hairline bg-surface px-3 text-sm text-muted hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-strong disabled:cursor-not-allowed disabled:opacity-40 aria-pressed:border-primary-tint aria-pressed:bg-primary-tint aria-pressed:font-semibold aria-pressed:text-primary-strong md:px-4"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
