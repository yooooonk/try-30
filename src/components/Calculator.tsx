import { useState } from 'react'
import { dayIndex, fiberTarget, foods, intakeTotals, proteinTarget, round1, weekOf } from '../lib/calc'
import type { AppState, Profile } from '../types'
import { Card, ghostBtnCls, Progress } from './ui'

/** 탭별로 보여줄 카테고리 (해당 영양소가 의미 있는 것만) */
const CATEGORIES = {
  fiber: ['채소', '버섯', '해조류', '뿌리채소', '콩', '곡물·씨앗', '과일'],
  protein: ['육류', '해산물', '계란·유제품', '콩', '곡물·씨앗'],
} as const

interface Props {
  profile: Profile
  date: string
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  latestWeight: number
  onBack: () => void
}

export function Calculator({ profile, date, state, update, latestWeight, onBack }: Props) {
  const [kind, setKind] = useState<'fiber' | 'protein'>('fiber')
  const [cat, setCat] = useState('전체')
  const items = state.intake[date] ?? {}
  const total = intakeTotals(items)
  const week = weekOf(dayIndex(profile.startDate, date))

  const setCount = (id: string, n: number) =>
    update((s) => {
      const cur = { ...(s.intake[date] ?? {}) }
      if (n <= 0) delete cur[id]
      else cur[id] = n
      return { ...s, intake: { ...s.intake, [date]: cur } }
    })

  const catList: readonly string[] = CATEGORIES[kind]
  const cats = ['전체', ...catList]
  const rows = foods
    .filter((f) => (cat === '전체' ? catList.includes(f.category) : f.category === cat))
    .map((f) => ({ f, serving: round1((f.per100[kind] * f.serving.g) / 100) }))
    .sort((a, b) => Number(b.f.id in items) - Number(a.f.id in items) || b.serving - a.serving)
  const selectedCount = Object.keys(items).length

  return (
    <div className="space-y-4">
      <button className={ghostBtnCls} onClick={onBack}>← 홈으로</button>

      <div className="sticky top-0 z-10">
        <Card title="오늘 섭취량">
          <div className="space-y-3">
            <Progress label="식이섬유" value={total.fiber} target={fiberTarget(profile, week)} />
            <Progress label="단백질" value={total.protein} target={proteinTarget(profile, latestWeight)} />
          </div>
          {selectedCount > 0 && (
            <div className="mt-2 text-right text-xs text-stone-500">
              <button className="underline" onClick={() => update((s) => ({ ...s, intake: { ...s.intake, [date]: {} } }))}>
                모두 해제
              </button>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-stone-200 p-1 text-sm">
        {([['fiber', '식이섬유표'], ['protein', '단백질표']] as const).map(([k, label]) => (
          <button key={k} onClick={() => { setKind(k); setCat('전체') }} className={`rounded-md py-1.5 ${kind === k ? 'bg-white font-semibold shadow-sm' : 'text-stone-600'}`}>
            {label}
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap gap-1">
          {cats.map((c) => (
            <button key={c} className={`${ghostBtnCls} !px-2 !py-1 text-xs ${cat === c ? '!bg-emerald-100' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-stone-500">
            <tr><th className="pb-1">식품</th><th>1회분</th><th className="text-right">1회 함량</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map(({ f, serving }) => {
              const n = items[f.id]
              const on = n != null
              return (
                <tr
                  key={f.id}
                  className={`cursor-pointer ${on ? 'bg-emerald-100' : 'hover:bg-stone-50'}`}
                  onClick={() => setCount(f.id, on ? 0 : 1)}
                >
                  <td className="py-1.5 pl-1">{f.name}</td>
                  <td className="text-stone-600">{f.serving.label}</td>
                  <td className="text-right font-medium">{serving}g</td>
                  <td className="w-20 pr-1 text-right" onClick={(e) => e.stopPropagation()}>
                    {on && (
                      <span className="inline-flex items-center">
                        <button className="rounded bg-white px-1 text-xs leading-4 text-stone-600" onClick={() => setCount(f.id, n - 0.5)}>−</button>
                        <span className="w-5 text-center text-xs">{n}</span>
                        <button className="rounded bg-white px-1 text-xs leading-4 text-stone-600" onClick={() => setCount(f.id, n + 0.5)}>＋</button>
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
