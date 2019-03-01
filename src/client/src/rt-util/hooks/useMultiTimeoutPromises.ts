import { useEffect, useRef, useState } from 'react'
import { MultiTimeoutStage } from './common'
import { getDeferredPromise, wait } from '../asyncUtils'

export function useMultiTimeoutPromises(...params: MultiTimeoutStage[]) {
  const mountedRef = useRef(false)
  const [stage, setStage] = useState(0)
  const [gotoPromise, goToCb] = getDeferredPromise<[number, boolean]>()

  useEffect(() => {
    mountedRef.current = true
    const currentStage = params[stage]
    if (!currentStage) {
      return
    }
    const { onEnter = () => {}, onLeave = () => {} } = currentStage
    onEnter(stage)
    Promise.race<[number, boolean]>([
      wait<[number, boolean]>(currentStage.duration, [stage + 1, true]),
      gotoPromise as Promise<[number, boolean]>,
    ]).then(([nextStage, didTimeExpire]) => {
      if (didTimeExpire) {
        onLeave(stage)
      }
      if (mountedRef.current) {
        setStage(nextStage)
      }
    })
    return () => (mountedRef.current = false)
  }, [stage])

  return [stage, (val: number) => goToCb([val, false])] as [number, (val: number) => void]
}
