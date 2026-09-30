import { useEffect, useState } from 'react'
import type { AppState } from './types'

const KEY = 'try30.v1'

const empty: AppState = { profile: null, days: {}, meals: {}, week2: {}, day1: {}, day28: {} }

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* 저장 실패는 무시 */
    }
  }, [state])
  return [state, setState] as const
}
