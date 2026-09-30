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
  water?: number
  sleep?: number
  exercise?: string
  steps?: number
  bannedCount?: number
  gratitude?: string
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
  week2: { weight?: number; waist?: number }
  day1: Measure
  day28: Measure
}
