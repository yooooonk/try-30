import { dayIndex, guide, sumEntries, waterTarget, weekOf } from '../lib/calc'
import type { AppState, DayLog, Measure, Profile } from '../types'
import { Card, Field, inputCls, NumInput } from './ui'

interface Props {
  profile: Profile
  date: string
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  latestWeight: number
}

export function Log({ profile, date, state, update, latestWeight }: Props) {
  const day = dayIndex(profile.startDate, date)
  const week = weekOf(day)
  const w = guide.weeks[week - 1]
  const log = state.days[date] ?? {}
  const total = sumEntries(state.meals[date] ?? [])
  const set = (patch: Partial<DayLog>) =>
    update((s) => ({ ...s, days: { ...s.days, [date]: { ...s.days[date], ...patch } } }))

  return (
    <div className="space-y-4">
      <Card title={`DAY ${day} · ${week}주차 — ${w.title}`}>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {w.missions.map((m) => <li key={m}>{m}</li>)}
        </ul>
        <p className="mt-2 text-sm">운동: {w.exercise}</p>
        {w.ban.length > 0 && <p className="mt-1 text-sm text-red-600">이번 주 끊기: {w.ban.join(' · ')}</p>}
        <p className="mt-2 rounded-lg bg-amber-50 p-2 text-sm text-amber-800">{w.note}</p>
      </Card>

      <Card title="오늘 기록">
        <div className="grid grid-cols-2 gap-3">
          <Field label="체중 (kg) · 아침 공복"><NumInput value={log.weight} onChange={(v) => set({ weight: v })} /></Field>
          <Field label={`물 (L) · 목표 ${waterTarget(latestWeight)}`}><NumInput value={log.water} onChange={(v) => set({ water: v })} /></Field>
          <Field label="잠 (h) · 7 이상"><NumInput value={log.sleep} onChange={(v) => set({ sleep: v })} /></Field>
          <Field label="걸음수 · 7,000 이상"><NumInput step={100} value={log.steps} onChange={(v) => set({ steps: v })} /></Field>
          <Field label="금지식품 (회)"><NumInput step={1} value={log.bannedCount} onChange={(v) => set({ bannedCount: v })} /></Field>
          <Field label="운동 종류">
            <input className={inputCls} value={log.exercise ?? ''} onChange={(e) => set({ exercise: e.target.value })} />
          </Field>
        </div>
        <p className="mt-3 text-sm text-stone-600">식이섬유 {total.fiber}g · 단백질 {total.protein}g (먹은 기록에서 자동 합산)</p>
        <div className="mt-3">
          <Field label="오늘 감사한 일 한 줄">
            <input className={inputCls} value={log.gratitude ?? ''} onChange={(e) => set({ gratitude: e.target.value })} />
          </Field>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={profile.muscleLoss}
            onChange={(e) => update((s) => ({ ...s, profile: s.profile && { ...s.profile, muscleLoss: e.target.checked } }))}
          />
          골격근이 줄었다 (단백질 목표 ×1.7)
        </label>
      </Card>

      <Card title="2주차 중간 점검">
        <div className="grid grid-cols-2 gap-3">
          <Field label="체중 (kg)"><NumInput value={state.week2.weight} onChange={(v) => update((s) => ({ ...s, week2: { ...s.week2, weight: v } }))} /></Field>
          <Field label="허리둘레 (cm)"><NumInput value={state.week2.waist} onChange={(v) => update((s) => ({ ...s, week2: { ...s.week2, waist: v } }))} /></Field>
        </div>
      </Card>

      <MeasureCard title="1일차 측정" value={state.day1} onChange={(m) => update((s) => ({ ...s, day1: m }))} />
      <MeasureCard title="28일차 측정" value={state.day28} onChange={(m) => update((s) => ({ ...s, day28: m }))} />
      <Compare day1={state.day1} day28={state.day28} />
    </div>
  )
}

function MeasureCard({ title, value, onChange }: { title: string; value: Measure; onChange: (m: Measure) => void }) {
  const num = (k: 'weight' | 'bodyFat' | 'muscle' | 'waist', label: string) => (
    <Field label={label}><NumInput value={value[k]} onChange={(v) => onChange({ ...value, [k]: v })} /></Field>
  )
  return (
    <Card title={title}>
      <div className="grid grid-cols-2 gap-3">
        {num('weight', '체중 (kg)')}
        {num('bodyFat', '체지방량 (kg)')}
        {num('muscle', '골격근량 (kg)')}
        {num('waist', '허리둘레 (cm)')}
        <Field label="컨디션·수면">
          <input className={inputCls} value={value.condition ?? ''} onChange={(e) => onChange({ ...value, condition: e.target.value })} />
        </Field>
        <Field label="군것질 생각">
          <input className={inputCls} value={value.craving ?? ''} onChange={(e) => onChange({ ...value, craving: e.target.value })} />
        </Field>
      </div>
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
