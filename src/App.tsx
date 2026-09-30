import { useState } from 'react'
import { Calculator } from './components/Calculator'
import { Log } from './components/Log'
import { Disclaimer, Onboarding } from './components/Onboarding'
import { Recommend } from './components/Recommend'
import { Home } from './components/Home'
import { WeightChart } from './components/WeightChart'
import { todayStr } from './lib/calc'
import { useAppState } from './store'
import type { AppState } from './types'

const TABS = ['홈', '기록', '그래프', '프로그램'] as const

export default function App() {
  const [state, setState] = useAppState()
  const [tab, setTab] = useState<(typeof TABS)[number]>('홈')
  const [calc, setCalc] = useState(false)
  const { profile: saved } = state

  if (!saved) return <Onboarding onDone={(p) => setState((s) => ({ ...s, profile: p }))} />

  const today = todayStr()
  // 1일차 측정 기록이 있으면 그 날짜로 고정, 없으면 오늘이 DAY 1
  const profile = { ...saved, startDate: state.day1Date ?? today }
  const update = (fn: (s: AppState) => AppState) => setState(fn)

  // 가장 최근 체중 (선택한 날짜 이전 기준)
  const weightDates = Object.keys(state.days).filter((d) => d <= today && state.days[d].weight != null).sort()
  const latestWeight = weightDates.length ? state.days[weightDates.at(-1)!].weight! : profile.weight

  const common = { profile, date: today, state, update, latestWeight }

  if (calc) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-4 pb-16">
        <Calculator {...common} onBack={() => setCalc(false)} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md pb-16">
      <header className="sticky top-0 z-10 bg-stone-50/95 p-4 backdrop-blur">
        <nav className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-stone-200 p-1 text-sm">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md py-1.5 ${tab === t ? 'bg-white font-semibold shadow-sm' : 'text-stone-600'}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>
      <main className="space-y-4 px-4">
        {tab === '프로그램' && <Home />}
        {tab === '기록' && <Log profile={profile} state={state} update={update} />}
        {tab === '그래프' && <WeightChart profile={profile} state={state} date={today} />}
        {tab === '홈' && <Recommend {...common} onOpenCalc={() => setCalc(true)} />}
        <Disclaimer />
        <button className="text-xs text-stone-400 underline" onClick={() => { if (confirm('모든 기록을 지우고 처음부터 시작할까요?')) setState({ profile: null, days: {}, intake: {}, checks: {}, day1: {}, day28: {} }) }}>
          초기화
        </button>
      </main>
    </div>
  )
}
