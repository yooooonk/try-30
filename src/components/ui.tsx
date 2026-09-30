import type { ReactNode } from 'react'

export const Card = ({ title, children }: { title?: string; children: ReactNode }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
    {title && <h2 className="mb-3 text-sm font-semibold text-stone-500">{title}</h2>}
    {children}
  </section>
)

export const inputCls =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none'
export const btnCls =
  'rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-40'
export const ghostBtnCls =
  'rounded-lg border border-stone-300 px-3 py-2 text-sm hover:bg-stone-100'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-stone-600">{label}</span>
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
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-stone-600">
          <b className={done ? 'text-emerald-600' : ''}>{value}</b> / {target}
          {unit}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-200">
        <div className={`h-full ${done ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
