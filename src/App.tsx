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

const ICONS: Record<(typeof TABS)[number], string> = {
  홈: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  기록: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  그래프: 'M4 20V4M4 20h16M8 15l4-5 3 3 5-7',
  프로그램: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11',
}

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
      <div className="mx-auto max-w-md space-y-4 p-4 pb-10">
        <Calculator {...common} onBack={() => setCalc(false)} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md pb-32">
      <header className="flex items-center justify-between px-5 pb-2 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">내 몸을 바꾸는 4주</h1>
        <span className="rounded-full bg-butter px-3 py-1 text-xs font-semibold">4주 다이어트</span>
      </header>
      <main className="space-y-4 px-4">
        {tab === '프로그램' && <Home />}
        {tab === '기록' && <Log profile={profile} state={state} update={update} />}
        {tab === '그래프' && <WeightChart profile={profile} state={state} date={today} />}
        {tab === '홈' && <Recommend {...common} onOpenCalc={() => setCalc(true)} />}
        <Disclaimer />
        <button className="text-xs text-ink/40 underline" onClick={() => { if (confirm('모든 기록을 지우고 처음부터 시작할까요?')) setState({ profile: null, days: {}, intake: {}, checks: {}, day1: {}, day28: {} }) }}>
          초기화
        </button>
      </main>
      <nav className="fixed inset-x-0 bottom-4 z-20 mx-auto flex w-[calc(100%-2rem)] max-w-sm justify-around rounded-full bg-ink p-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-label={t}
            className={`flex w-16 flex-col items-center gap-0.5 rounded-full py-1.5 text-[10px] ${tab === t ? 'bg-butter text-ink' : 'text-white/70'}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[t]} />
            </svg>
            {t}
          </button>
        ))}
      </nav>
    </div>
  )
}
