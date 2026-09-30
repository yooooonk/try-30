import guide from '../../data/guide.json'
import foodsJson from '../../data/foods.json'
import type { Food, Profile, TypeId } from '../types'

export const foods = foodsJson as Food[]
export { guide }

export const round1 = (n: number) => Math.round(n * 10) / 10

export function toDateStr(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
export const todayStr = () => toDateStr(new Date())

function dayNumber(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return Date.UTC(y, m - 1, d) / 86400000
}

/** 시작일 기준 DAY (1부터). 시작 전이면 0 이하 */
export function dayIndex(start: string, date: string): number {
  return dayNumber(date) - dayNumber(start) + 1
}

export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return toDateStr(new Date(y, m - 1, d + n))
}

export const weekOf = (day: number) => Math.min(4, Math.max(1, Math.ceil(day / 7)))

export const bmi = (kg: number, cm: number) => kg / (cm / 100) ** 2

export function typeOf(p: Pick<Profile, 'height' | 'weight' | 'lowMuscle'>): TypeId {
  const b = bmi(p.weight, p.height)
  if (b >= 25) return 'A'
  if (b > 23) return 'B'
  return p.lowMuscle ? 'D' : 'C'
}

export function fiberTarget(p: Profile, week: number): number {
  const full = guide.targets.fiber[p.sex]
  const w = guide.weeks[week - 1].fiberTarget
  return Math.min(full, w[1])
}

export function proteinTarget(p: Profile, weight: number): number {
  const per = p.muscleLoss ? guide.targets.proteinPerKgIfMuscleLoss : guide.targets.proteinPerKg
  return Math.round(weight * per)
}

export const waterTarget = (weight: number) => round1((weight * guide.targets.waterMlPerKg) / 1000)

/** 합계는 항상 식품별 값을 더해서 구한다 (식품 id → 1회분 횟수) */
export function intakeTotals(items: Record<string, number> = {}) {
  let fiber = 0
  let protein = 0
  for (const [id, n] of Object.entries(items)) {
    const f = foods.find((x) => x.id === id)
    if (!f) continue
    const k = (f.serving.g * n) / 100
    fiber += f.per100.fiber * k
    protein += f.per100.protein * k
  }
  return { fiber: round1(fiber), protein: round1(protein) }
}

export function movingAverage(values: (number | undefined)[], window = 7): (number | undefined)[] {
  return values.map((_, i) => {
    const xs = values.slice(Math.max(0, i - window + 1), i + 1).filter((v): v is number => v != null)
    return xs.length ? round1(xs.reduce((a, b) => a + b, 0) / xs.length) : undefined
  })
}
