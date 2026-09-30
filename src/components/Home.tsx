import { useState } from 'react'
import { foods, guide, round1, typeOf } from '../lib/calc'
import type { Profile } from '../types'
import { Card, ghostBtnCls } from './ui'

export function Home({ profile }: { profile: Profile }) {
  const type = guide.types.find((t) => t.id === typeOf(profile))!
  return (
    <div className="space-y-4">
      <Card title="나의 갈래">
        <p className="font-semibold">갈래 {type.id} · {type.name}</p>
        <p className="mt-1 text-sm text-stone-600">{type.rx}</p>
        <p className="mt-1 text-sm">4주 목표: {type.goal4w[0] === 0 ? '체중 유지' : `${type.goal4w[1]} ~ ${type.goal4w[0]}kg`}</p>
      </Card>

      <Card title="식단 원칙 5줄">
        <ol className="space-y-1 text-sm">
          {guide.principles.map((p) => (
            <li key={p.no}><span className="mr-1 rounded bg-emerald-100 px-1.5 text-xs text-emerald-800">{p.kind}</span>{p.text}</li>
          ))}
        </ol>
      </Card>

      <Card title="4주 전체 계획">
        <div className="space-y-4">
          {guide.weeks.map((w) => (
            <div key={w.week} className="border-l-4 border-emerald-400 pl-3 text-sm">
              <p className="font-semibold">{w.week}주차 · {w.title}</p>
              <p className="text-stone-600">
                식이섬유 {w.fiberTarget[0] === w.fiberTarget[1] ? `${w.fiberTarget[0]}g` : `${w.fiberTarget[0]} → ${w.fiberTarget[1]}g`}
                {w.expected && ` · 예상 체중 ${w.expected[0]} ~ ${w.expected[1]}kg`}
              </p>
              <ul className="mt-1 list-disc pl-5">{w.missions.map((m) => <li key={m}>{m}</li>)}</ul>
              <p className="mt-1">운동: {w.exercise}</p>
              {w.ban.length > 0 && <p className="text-red-600">끊기: {w.ban.join(' · ')}</p>}
              <p className="mt-1 text-amber-800">{w.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <NutrientTable kind="fiber" title="식이섬유표" />
      <NutrientTable kind="protein" title="단백질표" />
    </div>
  )
}

function NutrientTable({ kind, title }: { kind: 'fiber' | 'protein'; title: string }) {
  const [cat, setCat] = useState('전체')
  const cats = ['전체', ...new Set(foods.map((f) => f.category))]
  const rows = foods
    .filter((f) => cat === '전체' || f.category === cat)
    .map((f) => ({ f, per100: f.per100[kind], serving: round1((f.per100[kind] * f.serving.g) / 100) }))
    .sort((a, b) => b.serving - a.serving)

  return (
    <Card title={`${title} (1회분 기준 내림차순)`}>
      <div className="mb-3 flex flex-wrap gap-1">
        {cats.map((c) => (
          <button key={c} className={`${ghostBtnCls} !px-2 !py-1 text-xs ${cat === c ? '!bg-emerald-100' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-stone-500">
          <tr><th className="pb-1">식품</th><th>1회분</th><th className="text-right">1회 함량</th><th className="text-right">100g당</th></tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map(({ f, per100, serving }) => (
            <tr key={f.id}>
              <td className="py-1.5">
                {f.name}
                {f.src[kind] === 'est' && <span className="ml-1 rounded bg-amber-100 px-1 text-xs text-amber-700">추정</span>}
              </td>
              <td className="text-stone-600">{f.serving.label}</td>
              <td className="text-right font-medium">{serving}g</td>
              <td className="text-right text-stone-600">{per100}g</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
