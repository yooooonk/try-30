import type { ReactNode } from 'react'

export type Tone = 'paper' | 'butter' | 'pink' | 'sage' | 'sky'

const TONES: Record<Tone, string> = {
  paper: 'bg-paper',
  butter: 'bg-butter',
  pink: 'bg-pink',
  sage: 'bg-sage',
  sky: 'bg-sky',
}

export const Card = ({ title, tone = 'paper', children }: { title?: string; tone?: Tone; children: ReactNode }) => (
  <section className={`rounded-[28px] p-5 ${TONES[tone]}`}>
    {title && <h2 className="mb-3 text-sm font-semibold text-ink/60">{title}</h2>}
    {children}
  </section>
)

export const inputCls =
  'w-full rounded-2xl bg-black/5 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink'
export const btnCls =
  'rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/85 disabled:opacity-40'
export const ghostBtnCls = 'rounded-full bg-white/70 px-3.5 py-2 text-sm hover:bg-white'
/** 선택된 상태의 버튼/칩 (ghostBtnCls 위에 덮어쓴다) */
export const onCls = '!bg-ink !text-white'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-ink/70">{label}</span>
      {children}
    </label>
  )
}

export function NumInput({
  value,
  onChange,
  step = 0.1,
  placeholder,
}: {
  value: number | undefined
  onChange: (v: number | undefined) => void
  step?: number
  placeholder?: string
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      className={inputCls}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
    />
  )
}

export function Progress({ label, value, target, unit = 'g' }: { label: string; value: number; target: number; unit?: string }) {
  const pct = Math.min(100, (value / target) * 100)
  const done = value >= target
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-ink/60">
          <b className="text-2xl font-bold text-ink">{value}</b> / {target}
          {unit}
        </span>
      </div>
      <div className="h-3.5 overflow-hidden rounded-full bg-black/10">
        <div className={`h-full rounded-full ${done ? 'bg-plum' : 'bg-ink'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
