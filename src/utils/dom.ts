import { funnel } from 'remeda'

export function throttle<T extends (arg?: any) => any>(fn: T, waitMs: number): () => void {
  const throttled = funnel(
    () => {
      fn()
    },
    {
      minGapMs: waitMs,
      triggerAt: 'start',
    },
  )

  return () => {
    throttled.call()
  }
}
