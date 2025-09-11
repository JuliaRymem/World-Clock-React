// A custom React hook to store and read values from localStorage
// - <T> makes the hook reusable for any type of data (string, number, object, array, etc.)
// - Works like useState, but also saves the value in the browser's localStorage

import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  // State that holds the current value
  // If there is already a saved value in localStorage, we load it.
  // If not, we start with the "initial" value.
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw != null) return JSON.parse(raw) as T
    } catch {
      // If something goes wrong (bad JSON), just ignore and use initial
    }
    return initial
  })

  // Whenever the value changes, save it to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore errors (for example: storage full or private browsing mode)
    }
  }, [key, value])

  // Return the state and the updater function
  // "as const" means it behaves like a tuple ([value, setValue])
  return [value, setValue] as const
}

export default useLocalStorage