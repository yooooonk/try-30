import { useState } from 'react'
import { addDays, dayIndex, todayStr } from '../lib/calc'
import type { AppState, DayLog, Measure, Profile, WeekCheck } from '../types'
import { Card, Field, ghostBtnCls, inputCls, NumInput } from './ui'

interface Props {
  profile: Profile
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
}

const hasMeasure = (m: Measure) => Object.values(m).some((v) => v !== undefined && v !== '')

const isRecorded = (d?: DayLog) =>
  !!d && Object.values(d).some((v) => v !== undefined && v !== '')

export function Log({ profile, state, update }: Props) {
  const [open, setOpen] = useState<'day1' | 'day28' | null>(null)
  const today = todayStr()
  const dates = Array.from({ length: 28 }, (_, i) => addDays(profile.startDate, i))
  const todayDay = dayIndex(profile.startDate, today)
  const [selected, setSelected] = useState(Math.min(28, Math.max(1, todayDay)))
  const date = dates[selected - 1]
  const log = state.days[date] ?? {}
  const isWeekEnd = selected % 7 === 0
  const week = selected / 7

  const set = (patch: Partial<DayLog>) =>
    update((s) => ({ ...s, days: { ...s.days, [date]: { ...s.days[date], ...patch } } }))
  const setCheck = (patch: Partial<WeekCheck>) =>
    update((s) => ({ ...s, checks: { ...s.checks, [week]: { ...s.checks[week], ...patch } } }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {([['day1', '1일차 측정'], ['day28', '28일차 측정']] as const).map(([k, label]) => (
          <button
            key={k}
            className={`${ghostBtnCls} ${open === k ? '!border-emerald-500 !bg-emerald-50 font-semibold' : ''}`}
            onClick={() => setOpen(open === k ? null : k)}
          >
            {label}
          </button>
        ))}
      </div>
      {open === 'day1' && <MeasureCard title="1일차 측정" value={state.day1} onChange={(m) => update((s) => ({ ...s, day1: m, day1Date: hasMeasure(m) ? (s.day1Date ?? today) : undefined }))} />}
      {open === 'day28' && <MeasureCard title="28일차 측정" value={state.day28} onChange={(m) => update((s) => ({ ...s, day28: m }))} />}
      {open && <Compare day1={state.day1} day28={state.day28} />}

      <Card title="28일 달력">
        <div className="space-y-2">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="grid grid-cols-[2.5rem_repeat(7,1fr)] items-center gap-1 text-center">
              <span className="text-xs text-stone-500">{row + 1}주</span>
              {dates.slice(row * 7, row * 7 + 7).map((d, c) => {
                const n = row * 7 + c + 1
                const recorded = isRecorded(state.days[d])
                const exercised = state.days[d]?.exercise === true
                return (
                  <button
                    key={d}
                    onClick={() => setSelected(n)}
                    className={`rounded-lg py-1 text-xs ${selected === n ? 'bg-stone-200' : ''} ${d === today ? 'font-bold' : ''}`}
                  >
                    <span
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                        recorded ? 'bg-emerald-500 text-white' : 'border border-stone-300'
                      } ${exercised ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}
                    >
                      {n}
                    </span>
                    <span className="text-[10px] text-stone-400">{d.slice(5).replace('-', '/')}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone-500">초록 동그라미 = 기록한 날 · 주황 테두리 = 운동한 날 · 굵은 글씨 = 오늘</p>
      </Card>

      <Card title={`DAY ${selected} 기록 · ${date}${date === today ? ' (오늘)' : ''}`}>
        <div className="space-y-4">
          <Field label="체중 (kg) · 아침 공복">
            <NumInput value={log.weight} onChange={(v) => set({ weight: v })} />
          </Field>
          <OX label="물 (체중 × 30ml)" value={log.water} onChange={(v) => set({ water: v })} />
          <OX label="잠 7시간 이상" value={log.sleepOk} onChange={(v) => set({ sleepOk: v })} />
          <OX label="걸음수 7,000걸음 이상" value={log.stepsOk} onChange={(v) => set({ stepsOk: v })} />
          <OX label="운동" value={log.exercise} onChange={(v) => set({ exercise: v })} />
          <Field label="먹은 금지식품">
            <input className={inputCls} placeholder="없으면 비워두세요" value={log.banned ?? ''} onChange={(e) => set({ banned: e.target.value })} />
          </Field>
          <Field label="오늘 감사한 일 한 줄">
            <input className={inputCls} value={log.gratitude ?? ''} onChange={(e) => set({ gratitude: e.target.value })} />
          </Field>
        </div>
      </Card>

      {isWeekEnd && (
        <Card title={`${week}주차 중간 점검`}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="체중 (kg)"><NumInput value={state.checks[week]?.weight} onChange={(v) => setCheck({ weight: v })} /></Field>
            <Field label="근육량 (kg)"><NumInput value={state.checks[week]?.muscle} onChange={(v) => setCheck({ muscle: v })} /></Field>
          </div>
        </Card>
      )}
    </div>
  )
}

function OX({ label, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean | undefined) => void }) {
  const btn = (v: boolean, text: string, on: string) => (
    <button
      type="button"
      className={`${ghostBtnCls} w-14 ${value === v ? on : ''}`}
      onClick={() => onChange(value === v ? undefined : v)}
    >
      {text}
    </button>
  )
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <div className="flex gap-2">
        {btn(true, 'O', '!border-emerald-500 !bg-emerald-50 font-semibold text-emerald-700')}
        {btn(false, 'X', '!border-red-400 !bg-red-50 font-semibold text-red-600')}
      </div>
    </div>
  )
}

function MeasureCard({ title, value, onChange }: { title: string; value: Measure; onChange: (m: Measure) => void }) {
  const [draft, setDraft] = useState<Measure>(value)
  const [saved, setSaved] = useState(false)
  const edit = (patch: Partial<Measure>) => {
    setDraft({ ...draft, ...patch })
    setSaved(false)
  }
  const save = () => {
    if (JSON.stringify(draft) === JSON.stringify(value)) return
    onChange(draft)
    setSaved(true)
  }
  const num = (k: 'weight' | 'bodyFat' | 'muscle' | 'waist', label: string) => (
    <Field label={label}><NumInput value={draft[k]} onChange={(v) => edit({ [k]: v })} /></Field>
  )
  return (
    <Card title={title}>
      <div className="grid grid-cols-2 gap-3" onBlur={save}>
        {num('weight', '체중 (kg)')}
        {num('bodyFat', '체지방량 (kg)')}
        {num('muscle', '골격근량 (kg)')}
        {num('waist', '허리둘레 (cm)')}
        <Field label="컨디션·수면">
          <input className={inputCls} value={draft.condition ?? ''} onChange={(e) => edit({ condition: e.target.value })} />
        </Field>
        <Field label="군것질 생각">
          <input className={inputCls} value={draft.craving ?? ''} onChange={(e) => edit({ craving: e.target.value })} />
        </Field>
      </div>
      {saved && <p className="mt-3 text-sm text-emerald-600">저장됐어요</p>}
    </Card>
  )
}

function Compare({ day1, day28 }: { day1: Measure; day28: Measure }) {
  const rows: [string, keyof Measure][] = [['체중', 'weight'], ['체지방량', 'bodyFat'], ['골격근량', 'muscle'], ['허리둘레', 'waist']]
  const shown = rows.filter(([, k]) => day1[k] != null && day28[k] != null)
  if (shown.length === 0) return null
  return (
    <Card title="1일차 → 28일차">
      <ul className="space-y-1 text-sm">
        {shown.map(([label, k]) => {
          const diff = Math.round(((day28[k] as number) - (day1[k] as number)) * 10) / 10
          return <li key={k}>{label}: {day1[k]} → {day28[k]} ({diff > 0 ? '+' : ''}{diff})</li>
        })}
      </ul>
    </Card>
  )
}
