import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { addDays, dayIndex, guide, movingAverage, typeOf } from '../lib/calc'
import type { AppState, Profile } from '../types'
import { Card } from './ui'

export function WeightChart({ profile, state, date }: { profile: Profile; state: AppState; date: string }) {
  const startWeight = state.days[profile.startDate]?.weight ?? profile.weight
  const type = guide.types.find((t) => t.id === typeOf({ ...profile, weight: profile.weight }))!
  const dates = Array.from({ length: 28 }, (_, i) => addDays(profile.startDate, i))
  const raw = dates.map((d) => state.days[d]?.weight)
  const ma = movingAverage(raw)
  const data = dates.map((_, i) => ({ day: `D${i + 1}`, weight: raw[i], avg: ma[i] }))

  const [lo, hi] = type.goal4w
  const bandLow = startWeight + lo
  const bandHigh = startWeight + hi
  const vals = [...raw, bandLow, bandHigh, startWeight].filter((v): v is number => v != null)
  const yMin = Math.floor(Math.min(...vals) - 1)
  const yMax = Math.ceil(Math.max(...vals) + 1)
  const inWeek2 = dayIndex(profile.startDate, date) >= 8 && dayIndex(profile.startDate, date) <= 14

  return (
    <div className="space-y-4">
      <Card title="체중 변화 (28일)">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="day" interval={6} tick={{ fontSize: 12 }} />
              <YAxis domain={[yMin, yMax]} tick={{ fontSize: 12 }} />
              <Tooltip />
              {type.id !== 'D' && <ReferenceArea y1={bandLow} y2={bandHigh} fill="#10b981" fillOpacity={0.12} />}
              <Line type="monotone" dataKey="weight" name="일별 체중" stroke="#a8a29e" dot={{ r: 2 }} connectNulls />
              <Line type="monotone" dataKey="avg" name="7일 이동평균" stroke="#059669" strokeWidth={3} dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          초록 띠 = 갈래 {type.id} 4주 목표 범위({type.goal4w[0] === 0 ? '유지' : `${hi}~${lo}kg`}, 시작 체중 {startWeight}kg 기준).
          하루 숫자가 아니라 7일 흐름을 보세요.
        </p>
      </Card>
      {inWeek2 && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          2주차는 체중이 정체되는 주예요. 체중계 대신 허리둘레를 보세요. 굶지 마세요.
        </p>
      )}
    </div>
  )
}
