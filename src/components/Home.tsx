import { guide } from '../lib/calc'
import { Card } from './ui'

export function Home() {
  const patterns = [guide.mealPatterns.home, guide.mealPatterns.office, guide.mealPatterns.quick]

  return (
    <div className="space-y-4">
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
      </Card>
    </div>
  )
}
