export type Sex = 'female' | 'male'
export type TypeId = 'A' | 'B' | 'C' | 'D'

export interface Food {
  id: string
  name: string
  category: string
  serving: { label: string; g: number }
  per100: { fiber: number; protein: number }
  src: { fiber: 'pdf' | 'est'; protein: 'pdf' | 'est' }
}

export interface Profile {
  sex: Sex
  height: number
  weight: number
  age: number
  lowMuscle: boolean
  muscleLoss: boolean
  startDate: string
}

export interface DayLog {
  weight?: number
  /** O/X 체크: true = O, false = X, 없으면 미입력 */
  water?: boolean
  sleepOk?: boolean
  stepsOk?: boolean
  banned?: string
  exercise?: boolean
  gratitude?: string
}

export interface WeekCheck {
  weight?: number
  muscle?: number
}

export interface MealEntry {
  id: string
  name: string
  category: string
  fiber: number
  protein: number
  /** 가이드북 수치가 아닌 추정치가 섞였는지 */
  est?: boolean
}

export interface Measure {
  weight?: number
  bodyFat?: number
  muscle?: number
  waist?: number
  condition?: string
  craving?: string
}

export interface AppState {
  profile: Profile | null
  days: Record<string, DayLog>
  meals: Record<string, MealEntry[]>
  /** 주차별 중간 점검 (키: 주차 번호) */
  checks: Record<number, WeekCheck>
  day1: Measure
  /** 1일차 측정을 저장한 날 — 있으면 달력의 DAY 1로 고정 */
  day1Date?: string
  day28: Measure
}
