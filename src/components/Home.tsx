import { useState } from 'react'
import { guide, round1 } from '../lib/calc'
import { Card, ghostBtnCls, onCls, type Tone } from './ui'

const WEEK_TONE: Tone[] = ['butter', 'pink', 'sky', 'sage']

export function Home() {
  return (
    <div className="space-y-4">
      {guide.weeks.map((w, i) => (
        <Card key={w.week} tone={WEEK_TONE[i]}>
          <p className="text-xs font-semibold text-ink/60">{w.week}주차</p>
          <h3 className="text-xl font-bold leading-snug">{w.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-white/70 px-3 py-1">
              식이섬유 {w.fiberTarget[0] === w.fiberTarget[1] ? `${w.fiberTarget[0]}g` : `${w.fiberTarget[0]}→${w.fiberTarget[1]}g`}
            </span>
            {w.expected && <span className="rounded-full bg-white/70 px-3 py-1">예상 {w.expected[0]}~{w.expected[1]}kg</span>}
            <span className="rounded-full bg-white/70 px-3 py-1">운동 · {w.exercise}</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {w.missions.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] text-white">✓</span>
                {m}
              </li>
            ))}
          </ul>
          {w.ban.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold">끊기</span>
              {w.ban.map((b) => <span key={b} className="rounded-full bg-plum px-3 py-1 font-medium text-white">{b}</span>)}
            </div>
          )}
          <p className="mt-4 rounded-2xl bg-white/60 p-3 text-sm">{w.note}</p>
        </Card>
      ))}

      <MenuRecommend />

      <Card title="외식·회식" tone="sage">
          <div className="space-y-3 text-sm">
            {guide.eatingOut.map((p) => (
              <div key={p.place}>
                <p className="font-semibold">{p.place}</p>
                <p className="font-medium text-ink">고르기: {p.pick.join(' / ')}</p>
                <p className="text-red-600">피하기: {p.avoid.join(' / ')}</p>
              </div>
            ))}
            <div>
              <p className="font-semibold">회식 저녁</p>
              <ul className="list-disc pl-5">{guide.dinnerOut.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
      </Card>
    </div>
  )
}

const PATTERNS = [guide.mealPatterns.home, guide.mealPatterns.office, guide.mealPatterns.quick]

function MenuRecommend() {
  const [idx, setIdx] = useState(0)
  const p = PATTERNS[idx]
  // 합계는 가이드북에 적힌 값이 아니라 끼니별 값을 더해서 계산한다
  const fiber = round1(p.meals.reduce((sum, m) => sum + m.fiber, 0))
  const protein = round1(p.meals.reduce((sum, m) => sum + m.protein, 0))

  return (
    <Card title="메뉴 추천" tone="butter">
      <div className="flex flex-wrap gap-2">
        {PATTERNS.map((x, i) => (
          <button key={x.name} className={`${ghostBtnCls} ${i === idx ? onCls : ''}`} onClick={() => setIdx(i)}>
            {x.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink/70">{p.desc}</p>

      <ul className="mt-3 space-y-2">
        {p.meals.map((m) => (
          <li key={m.slot} className="rounded-2xl bg-white/70 p-3">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-ink px-3 py-0.5 text-xs font-semibold text-white">{m.slot}</span>
              <span className="flex gap-1.5 text-xs font-medium">
                <span className="rounded-full bg-sage px-2.5 py-0.5">섬유 {m.fiber}g</span>
                <span className="rounded-full bg-pink px-2.5 py-0.5">단백 {m.protein}g</span>
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{m.menu}</p>
          </li>
        ))}
      </ul>

      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-2xl bg-sage p-3">
          <p className="text-xs font-medium">하루 식이섬유</p>
          <p className="text-2xl font-bold">{fiber}<span className="text-sm font-medium">g</span></p>
        </div>
        <div className="rounded-2xl bg-pink p-3">
          <p className="text-xs font-medium">하루 단백질</p>
          <p className="text-2xl font-bold">{protein}<span className="text-sm font-medium">g</span></p>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink/60">60kg 기준 · 합계는 끼니별 값을 더한 값이에요.</p>

      <div className="mt-5 space-y-4 border-t border-black/10 pt-4 text-sm">
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
  )
}
