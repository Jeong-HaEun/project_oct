// WoW 막대 비교 (design.md 5-8 막대). 지표 1개당 그래프 1개, 이번 주는 좋아짐 파랑 · 나빠짐 빨강.
// 값 계산은 summarizeCards · buildWowBars 가 하고, 여기서는 그리기만 한다.
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CARD_FORMATTERS } from '../utils/format.js'
import { buildWowBars } from '../utils/metrics.js'
import { ChangeBadge } from './ChangeBadge.jsx'

// 지난주는 회색 기준 막대. 이번 주는 좋아짐 파랑 · 나빠짐 빨강 · 판단 안 함(광고비 · 변화 없음) 진한 회색
const PREVIOUS_COLOR = 'var(--color-muted)'
const CURRENT_COLORS = {
  good: 'var(--color-good)',
  bad: 'var(--color-bad)',
  neutral: 'var(--color-ink)',
}

function barColor(bar, change) {
  if (bar.key === 'previous') return PREVIOUS_COLOR
  return CURRENT_COLORS[change?.tone ?? 'neutral']
}

const AXIS_TEXT = { fill: 'var(--color-muted)', fontSize: 12 }

export function WowBars({ cards }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2 md:gap-4">
      {cards.map((card) => (
        <WowBarCard key={card.key} card={card} />
      ))}
    </div>
  )
}

function WowBarCard({ card }) {
  const bars = buildWowBars(card)
  const format = CARD_FORMATTERS[card.key]

  return (
    <div className="rounded-lg border border-hairline bg-surface p-4 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-muted">{card.title}</h3>
        {card.change && <ChangeBadge change={card.change} />}
      </div>
      {bars === null ? (
        <p className="mt-3 text-sm text-muted">비교할 지난주 데이터 없음</p>
      ) : (
        <div className="mt-2 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bars}
              layout="vertical"
              margin={{ top: 0, right: 88, bottom: 0, left: 0 }}
              barCategoryGap={6}
            >
              {/* 막대는 0 에서 시작 (작은 차이가 부풀려 보이지 않게) */}
              <XAxis type="number" domain={[0, 'dataMax']} hide />
              <YAxis
                type="category"
                dataKey="label"
                width={52}
                tick={AXIS_TEXT}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-canvas)' }}
                formatter={(value) => [format(value), card.title]}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                isAnimationActive={false}
              >
                {bars.map((bar) => (
                  <Cell key={bar.key} fill={barColor(bar, card.change)} />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value) => format(value ?? null)}
                  style={{ fill: 'var(--color-ink)', fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
