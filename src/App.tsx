import { useState } from 'react'
import { Log } from './components/Log'
import { Disclaimer, Onboarding } from './components/Onboarding'
import { Recommend } from './components/Recommend'
import { Home } from './components/Home'
import { WeightChart } from './components/WeightChart'
import { ghostBtnCls, inputCls } from './components/ui'
import { addDays, dayIndex, todayStr } from './lib/calc'
import { useAppState } from './store'
import type { AppState } from './types'

const TABS = ['홈', '기록', '그래프', '추천'] as const

export default function App() {
  const [state, setState] = useAppState()
  const [tab, setTab] = useState<(typeof TABS)[number]>('홈')
  const [date, setDate] = useState(todayStr())
  const { profile } = state

  if (!profile) return <Onboarding onDone={(p) => setState((s) => ({ ...s, profile: p }))} />

  const update = (fn: (s: AppState) => AppState) => setState(fn)
  const day = dayIndex(profile.startDate, date)

  // 가장 최근 체중 (선택한 날짜 이전 기준)
  const weightDates = Object.keys(state.days).filter((d) => d <= date && state.days[d].weight != null).sort()
  const latestWeight = weightDates.length ? state.days[weightDates.at(-1)!].weight! : profile.weight

  const common = { profile, date, state, update, latestWeight }

  return (
    <div className="mx-auto max-w-md pb-16">
      <header className="sticky top-0 z-10 bg-stone-50/95 p-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <button className={ghostBtnCls} onClick={() => setDate(addDays(date, -1))}>◀</button>
          <input type="date" className={inputCls} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
          <button className={ghostBtnCls} onClick={() => setDate(addDays(date, 1))}>▶</button>
        </div>
        <p className="mt-1 text-center text-sm text-stone-500">
          {day < 1 ? '시작 전' : day > 28 ? '28일 이후' : `DAY ${day} / 28`}
        </p>
        <nav className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-stone-200 p-1 text-sm">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md py-1.5 ${tab === t ? 'bg-white font-semibold shadow-sm' : 'text-stone-600'}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>
      <main className="space-y-4 px-4">
        {tab === '홈' && <Home profile={profile} />}
        {tab === '기록' && <Log {...common} />}
        {tab === '그래프' && <WeightChart profile={profile} state={state} date={date} />}
        {tab === '추천' && <Recommend {...common} />}
        <Disclaimer />
        <button className="text-xs text-stone-400 underline" onClick={() => { if (confirm('모든 기록을 지우고 처음부터 시작할까요?')) setState({ profile: null, days: {}, meals: {}, week2: {}, day1: {}, day28: {} }) }}>
          초기화
        </button>
      </main>
    </div>
  )
}
