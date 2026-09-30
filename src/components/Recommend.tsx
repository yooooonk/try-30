import { fiberTarget, guide, intakeTotals, proteinTarget, typeOf, weekOf, dayIndex } from '../lib/calc'
import type { AppState, Profile } from '../types'
import { Card, Progress } from './ui'

export function Recommend({ profile, date, state, latestWeight, onOpenCalc }: { profile: Profile; date: string; state: AppState; latestWeight: number; onOpenCalc: () => void }) {
  const week = weekOf(dayIndex(profile.startDate, date))
  const fiberGoal = fiberTarget(profile, week)
  const proteinGoal = proteinTarget(profile, latestWeight)
  const intake = intakeTotals(state.intake[date])
  const type = typeOf({ ...profile, weight: profile.weight })

  const info = guide.types.find((t) => t.id === type)!

  return (
    <div className="space-y-4">
      <Card title="나의 갈래" tone="butter">
        <p className="font-semibold">갈래 {info.id} · {info.name}</p>
        <p className="mt-1 text-sm text-ink/70">{info.rx}</p>
        <p className="mt-1 text-sm">4주 목표: {info.goal4w[0] === 0 ? '체중 유지' : `${info.goal4w[1]} ~ ${info.goal4w[0]}kg`}</p>
      </Card>

      <button className="block w-full text-left" onClick={onOpenCalc}>
        <Card title="오늘 목표 · 눌러서 섭취 계산기 열기 ›" tone="sky">
          <div className="space-y-3">
            <Progress label="식이섬유" value={intake.fiber} target={fiberGoal} />
            <Progress label="단백질" value={intake.protein} target={proteinGoal} />
          </div>
          <p className="mt-3 text-xs text-ink/60">오늘 섭취량 / 목표</p>
          {type === 'C' && <p className="mt-2 text-sm text-ink/70">갈래 C: 밥은 1/2공기로 줄이고 간식 하나를 빼세요.</p>}
          {type === 'D' && <p className="mt-2 text-sm text-ink/70">갈래 D: 양을 절대 줄이지 마세요. 채우기와 근력운동만.</p>}
        </Card>
      </button>

      <Card title="식단 원칙 5줄" tone="sage">
        <ol className="space-y-1 text-sm">
          {guide.principles.map((p) => (
            <li key={p.no}><span className="mr-1 rounded-full bg-ink px-2 py-0.5 text-xs text-white">{p.kind}</span>{p.text}</li>
          ))}
        </ol>
        <p className="mt-3 rounded-2xl bg-white/60 p-3 text-xs">{guide.tips.slip}</p>
      </Card>
    </div>
  )
}
