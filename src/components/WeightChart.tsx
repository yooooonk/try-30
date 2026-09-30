import { CartesianGrid, Legend, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { addDays, dayIndex, guide, movingAverage, typeOf } from '../lib/calc'
import type { AppState, Profile } from '../types'
import { Card } from './ui'

export function WeightChart({ profile, state, date }: { profile: Profile; state: AppState; date: string }) {
  const startWeight = state.days[profile.startDate]?.weight ?? profile.weight
  const type = guide.types.find((t) => t.id === typeOf({ ...profile, weight: profile.weight }))!
  const dates = Array.from({ length: 28 }, (_, i) => addDays(profile.startDate, i))
  const raw = dates.map((d) => state.days[d]?.weight)
  const ma = movingAverage(raw)
  // 골격근량: 1일차 측정, 주차별 중간 점검(DAY 7·14·21·28), 28일차 측정
  const muscle: (number | undefined)[] = Array(28).fill(undefined)
  muscle[0] = state.day1.muscle
  for (const w of [1, 2, 3, 4]) muscle[w * 7 - 1] = state.checks[w]?.muscle
  if (state.day28.muscle != null) muscle[27] = state.day28.muscle
  const data = dates.map((_, i) => ({ day: `D${i + 1}`, weight: raw[i], avg: ma[i], muscle: muscle[i], start: i === 0 ? startWeight : undefined }))
  const mVals = muscle.filter((v): v is number => v != null)
  const hasMuscle = mVals.length > 0

  const [lo, hi] = type.goal4w
  const bandLow = startWeight + lo
  const bandHigh = startWeight + hi
  const vals = [...raw, bandLow, bandHigh, startWeight].filter((v): v is number => v != null)
  const yMin = Math.floor(Math.min(...vals) - 1)
  const yMax = Math.ceil(Math.max(...vals) + 1)
  const inWeek2 = dayIndex(profile.startDate, date) >= 8 && dayIndex(profile.startDate, date) <= 14

  return (
    <div className="space-y-4">
      <Card title="체중 · 골격근량 (28일)">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: hasMuscle ? -8 : 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="day" interval={6} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" domain={[yMin, yMax]} tick={{ fontSize: 12 }} />
              {hasMuscle && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[Math.floor(Math.min(...mVals) - 1), Math.ceil(Math.max(...mVals) + 1)]}
                  tick={{ fontSize: 12, fill: '#5b6fc4' }}
                />
              )}
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {type.id !== 'D' && <ReferenceArea yAxisId="left" y1={bandLow} y2={bandHigh} fill="#a9b685" fillOpacity={0.35} />}
              <Line yAxisId="left" dataKey="start" name="시작 체중" stroke="none" dot={{ r: 5, fill: '#16130f', stroke: 'none' }} activeDot={false} legendType="circle" />
              <Line yAxisId="left" type="monotone" dataKey="weight" name="일별 체중" stroke="#a8a29e" dot={{ r: 2 }} connectNulls />
              <Line yAxisId="left" type="monotone" dataKey="avg" name="7일 이동평균" stroke="#a64a80" strokeWidth={3} dot={false} connectNulls />
              {hasMuscle && (
                <Line yAxisId="right" type="monotone" dataKey="muscle" name="골격근량(우측 축)" stroke="#5b6fc4" strokeWidth={2} dot={{ r: 4 }} connectNulls />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-ink/60">
          초록 띠 = 갈래 {type.id} 4주 목표 범위({type.goal4w[0] === 0 ? '유지' : `${hi}~${lo}kg`}, 시작 체중 {startWeight}kg 기준).
          하루 숫자가 아니라 7일 흐름을 보세요. 골격근량은 1일차·주차별 중간 점검·28일차 측정값이 파란 점으로 표시됩니다.
        </p>
      </Card>
      {inWeek2 && (
        <p className="rounded-[28px] bg-butter p-4 text-sm">
          2주차는 체중이 정체되는 주예요. 체중계 대신 허리둘레를 보세요. 굶지 마세요.
        </p>
      )}
    </div>
  )
}
