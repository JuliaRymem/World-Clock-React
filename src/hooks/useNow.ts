// Hook that returns the current timestamp and updates it every tickMs milliseconds

import { useEffect, useState } from 'react'

export function useNow(tickMs: number = 1000): number {
  const [now, setNow] = useState<number>(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs)
    return () => clearInterval(id)
  }, [tickMs])
  return now
}