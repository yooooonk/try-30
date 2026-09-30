import { guide } from '../lib/calc'
import { Card } from './ui'

export function Home() {
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

    </div>
  )
}
