import { useState } from 'react'
import { bmi, guide, todayStr, typeOf } from '../lib/calc'
import type { Profile, Sex } from '../types'
import { btnCls, Card, Field, inputCls } from './ui'

export function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [sex, setSex] = useState<Sex>('female')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [lowMuscle, setLowMuscle] = useState(false)

  const h = Number(height)
  const w = Number(weight)
  const valid = h > 100 && w > 20 && Number(age) > 0
  const type = valid ? typeOf({ height: h, weight: w, lowMuscle }) : null
  const info = guide.types.find((t) => t.id === type)

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center space-y-4 p-4">
      <header className="pb-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">내 몸을 바꾸는 4주</h1>
        <p className="mt-2 text-sm text-ink/70">많이 드세요. 대신 좋은 걸 드세요.</p>
      </header>
      <Card title="내 정보">
        <div className="grid grid-cols-2 gap-3">
          <Field label="성별">
            <select className={inputCls} value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="female">여</option>
              <option value="male">남</option>
            </select>
          </Field>
          <Field label="나이">
            <input className={inputCls} type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </Field>
          <Field label="키 (cm)">
            <input className={inputCls} type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </Field>
          <Field label="체중 (kg)">
            <input className={inputCls} type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Field>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lowMuscle} onChange={(e) => setLowMuscle(e.target.checked)} />
          골격근량이 표준 이하 (인바디 기준)
        </label>
      </Card>
      {info && (
        <Card title="나의 갈래" tone="butter">
          <p className="font-semibold">
            갈래 {info.id} · {info.name} <span className="font-normal text-ink/60">(BMI {bmi(w, h).toFixed(1)})</span>
          </p>
          <p className="mt-1 text-sm text-ink/70">{info.rx}</p>
          <p className="mt-1 text-sm">
            4주 목표: {info.goal4w[0] === 0 ? '체중 유지' : `${info.goal4w[1]} ~ ${info.goal4w[0]}kg`}
          </p>
        </Card>
      )}
      <button
        className={`${btnCls} w-full`}
        disabled={!valid}
        onClick={() => onDone({ sex, height: h, weight: w, age: Number(age), lowMuscle, muscleLoss: false, startDate: todayStr() })}
      >
        시작하기
      </button>
    </div>
  )
}

export const Disclaimer = () => (
  <p className="text-xs text-ink/60">
    건강한 성인용 생활 가이드이며 의학적 진단을 대체하지 않습니다. 신장질환이 있으면 단백질을 늘리기 전에 의료진과 상의하세요.
  </p>
)
