import { useState } from 'react'
import { fiberTarget, foods, guide, intakeTotals, proteinTarget, round1, typeOf, weekOf, dayIndex } from '../lib/calc'
import type { AppState, Profile } from '../types'
import { Card, inputCls, Progress } from './ui'


export function Recommend({ profile, date, state, latestWeight, onOpenCalc }: { profile: Profile; date: string; state: AppState; latestWeight: number; onOpenCalc: () => void }) {
  const [q, setQ] = useState('')
  const [eatingOut, setEatingOut] = useState(false)

  const week = weekOf(dayIndex(profile.startDate, date))
  const fiberGoal = fiberTarget(profile, week)
  const proteinGoal = proteinTarget(profile, latestWeight)
  const intake = intakeTotals(state.intake[date])
  const type = typeOf({ ...profile, weight: profile.weight })

  // 목표를 (1회분 기준) 얼마나 채우는지로 점수화
  const score = (f: (typeof foods)[number]) => {
    const k = f.serving.g / 100
    return Math.min(f.per100.fiber * k, fiberGoal) + Math.min(f.per100.protein * k, proteinGoal)
  }
  const top = [...foods].sort((a, b) => score(b) - score(a)).slice(0, 6)

  const patterns = [guide.mealPatterns.home, guide.mealPatterns.office, guide.mealPatterns.quick]

  const hits = q.trim()
    ? guide.banned.filter((b) => b.category.includes(q.trim()) || b.items.some((i) => i.includes(q.trim())))
    : []

  const info = guide.types.find((t) => t.id === type)!

  return (
    <div className="space-y-4">
      <Card title="나의 갈래">
        <p className="font-semibold">갈래 {info.id} · {info.name}</p>
        <p className="mt-1 text-sm text-stone-600">{info.rx}</p>
        <p className="mt-1 text-sm">4주 목표: {info.goal4w[0] === 0 ? '체중 유지' : `${info.goal4w[1]} ~ ${info.goal4w[0]}kg`}</p>
      </Card>

      <button className="block w-full text-left" onClick={onOpenCalc}>
        <Card title="오늘 목표 · 눌러서 섭취 계산기 열기 ›">
          <div className="space-y-3">
            <Progress label="식이섬유" value={intake.fiber} target={fiberGoal} />
            <Progress label="단백질" value={intake.protein} target={proteinGoal} />
          </div>
          <p className="mt-3 text-xs text-stone-500">오늘 섭취량 / 목표</p>
          {type === 'C' && <p className="mt-2 text-sm text-stone-600">갈래 C: 밥은 1/2공기로 줄이고 간식 하나를 빼세요.</p>}
          {type === 'D' && <p className="mt-2 text-sm text-stone-600">갈래 D: 양을 절대 줄이지 마세요. 채우기와 근력운동만.</p>}
        </Card>
      </button>

      <Card title="식단 원칙 5줄">
        <ol className="space-y-1 text-sm">
          {guide.principles.map((p) => (
            <li key={p.no}><span className="mr-1 rounded bg-emerald-100 px-1.5 text-xs text-emerald-800">{p.kind}</span>{p.text}</li>
          ))}
        </ol>
      </Card>

      <Card title="목표를 잘 채우는 식품 (1회분 기준)">
        <ul className="divide-y divide-stone-100 text-sm">
          {top.map((f) => {
            const k = f.serving.g / 100
            return (
              <li key={f.id} className="flex justify-between py-2">
                <span>{f.name} <span className="text-stone-500">{f.serving.label}</span></span>
                <span className="text-stone-600">섬유 {round1(f.per100.fiber * k)} · 단백 {round1(f.per100.protein * k)}</span>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card title="추천 메뉴">
        <div className="space-y-4 text-sm">
          {patterns.map((p) => (
            <div key={p.name}>
              <p className="font-semibold">{p.name} <span className="font-normal text-stone-500">{p.desc}</span></p>
              <ul className="mt-1 space-y-1">
                {p.meals.map((m) => (
                  <li key={m.slot}>
                    <b>{m.slot}</b> {m.menu} <span className="text-stone-500">(섬유 {m.fiber} · 단백 {m.protein})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="font-semibold">아침 세트</p>
            <ul className="mt-1 space-y-1">
              {guide.breakfastSets.map((b) => <li key={b.name}><b>{b.name}</b> {b.menu}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-semibold">간식</p>
            <p className="mt-1">{guide.snacks.join(' · ')}</p>
          </div>
        </div>
      </Card>

      <Card title="외식·회식">
        <label className="mb-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={eatingOut} onChange={(e) => setEatingOut(e.target.checked)} /> 외식 모드
        </label>
        {eatingOut && (
          <div className="space-y-3 text-sm">
            {guide.eatingOut.map((p) => (
              <div key={p.place}>
                <p className="font-semibold">{p.place}</p>
                <p className="text-emerald-700">고르기: {p.pick.join(' / ')}</p>
                <p className="text-red-600">피하기: {p.avoid.join(' / ')}</p>
              </div>
            ))}
            <div>
              <p className="font-semibold">회식 저녁</p>
              <ul className="list-disc pl-5">{guide.dinnerOut.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
        )}
      </Card>

      <Card title="금지 식품 대체 검색">
        <input className={inputCls} placeholder="예: 라면, 맥주" value={q} onChange={(e) => setQ(e.target.value)} />
        {hits.map((b) => (
          <p key={b.category} className="mt-2 text-sm"><b>{b.category}</b> → 대체: {b.swap.join(' · ')}</p>
        ))}
        {q.trim() && hits.length === 0 && <p className="mt-2 text-sm text-stone-500">금지 목록에 없는 식품이에요.</p>}
        <p className="mt-3 text-xs text-stone-500">{guide.tips.slip}</p>
      </Card>
    </div>
  )
}
