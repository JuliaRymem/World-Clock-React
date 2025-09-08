// Generisk hook för att spara/läsa värden från localStorage.
// - T är en generisk typ (TypeScript) som gör hooken återanvändbar.

import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw) as T
    } catch {
      // ignore JSON parse errors
    }
    return initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors (storage full / private mode)
    }
  }, [key, value])

  return [value, setValue] as const
}

export default useLocalStorage

