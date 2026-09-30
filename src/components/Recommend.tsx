import { useState } from 'react'
import { fiberTarget, foods, guide, proteinTarget, round1, sumEntries, typeOf, weekOf, dayIndex } from '../lib/calc'
import type { AppState, Profile } from '../types'
import { Card, inputCls } from './ui'

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const DAY_KO = ['일', '월', '화', '수', '목', '금', '토']

export function Recommend({ profile, state, date, latestWeight }: { profile: Profile; state: AppState; date: string; latestWeight: number }) {
  const [q, setQ] = useState('')
  const [eatingOut, setEatingOut] = useState(false)

  const week = weekOf(dayIndex(profile.startDate, date))
  const total = sumEntries(state.meals[date] ?? [])
  const remFiber = Math.max(0, round1(fiberTarget(profile, week) - total.fiber))
  const remProtein = Math.max(0, round1(proteinTarget(profile, latestWeight) - total.protein))
  const type = typeOf({ ...profile, weight: profile.weight })

  const dow = new Date(date + 'T00:00:00').getDay()
  const rotation = guide.proteinRotation[DAY_KEYS[dow]]

  // 남은 양을 (1회분 기준) 얼마나 채우는지로 점수화
  const score = (f: (typeof foods)[number]) => {
    const k = f.serving.g / 100
    return Math.min(f.per100.fiber * k, remFiber) + Math.min(f.per100.protein * k, remProtein)
  }
  const top = [...foods].sort((a, b) => score(b) - score(a)).slice(0, 6)

  const hour = new Date().getHours()
  const slot = hour < 10 ? '아침' : hour < 14 ? '점심' : hour < 17 ? '간식' : '저녁'
  const slotMeals = Object.values({ home: guide.mealPatterns.home, office: guide.mealPatterns.office, quick: guide.mealPatterns.quick })
    .map((p) => ({ pattern: p.name, meal: p.meals.find((m) => m.slot === slot) }))
    .filter((x) => x.meal)

  const hits = q.trim()
    ? guide.banned.filter((b) => b.category.includes(q.trim()) || b.items.some((i) => i.includes(q.trim())))
    : []

  return (
    <div className="space-y-4">
      <Card title="오늘 남은 양">
        <p className="text-lg font-semibold">식이섬유 {remFiber}g · 단백질 {remProtein}g</p>
        {remFiber === 0 && remProtein === 0 && <p className="mt-1 text-sm text-emerald-600">오늘 목표를 다 채웠어요 🎉</p>}
        {type === 'C' && <p className="mt-2 text-sm text-stone-600">갈래 C: 밥은 1/2공기로 줄이고 간식 하나를 빼세요.</p>}
        {type === 'D' && <p className="mt-2 text-sm text-stone-600">갈래 D: 양을 절대 줄이지 마세요. 채우기와 근력운동만.</p>}
      </Card>

      <Card title={`${DAY_KO[dow]}요일 단백질 로테이션`}>
        <p className="text-sm">{rotation.join(' · ')}</p>
      </Card>

      <Card title="남은 양을 잘 채우는 식품 (1회분 기준)">
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

      <Card title={`지금은 ${slot} 시간 — 추천 메뉴`}>
        {slotMeals.map((x) => (
          <p key={x.pattern} className="py-1 text-sm">
            <b>{x.pattern}</b> {x.meal!.menu} <span className="text-stone-500">(섬유 {x.meal!.fiber} · 단백 {x.meal!.protein})</span>
          </p>
        ))}
        {slot === '아침' && guide.breakfastSets.map((b) => <p key={b.name} className="py-1 text-sm"><b>{b.name}</b> {b.menu}</p>)}
        {slot === '간식' && <p className="text-sm">{guide.snacks.join(' · ')}</p>}
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
