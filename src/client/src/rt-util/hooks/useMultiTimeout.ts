import { useEffect, useRef, useState } from 'react'
import { MultiTimeoutStage } from './common'

export function useMultiTimeout(...params: MultiTimeoutStage[]) {
  const mountedRef = useRef(false)
  const timeoutRef = useRef(0)
  const stageRef = useRef(0)
  const [stage, setStageInternal] = useState(stageRef.current)

  // Stage needs to be stored as both
  // - a ref object (for the timeout to get a fresh value), and
  // - via setState (so that the component gets unpdated with the stage)
  // and kept in sync
  const setStage = (newStage: number) => {
    stageRef.current = newStage
    setStageInternal(newStage)
  }

  function runStage() {
    if (stageRef.current < params.length) {
      const { onEnter = () => {}, duration = 0, onLeave = () => {} } = params[stageRef.current] || {}
      onEnter(stageRef.current)
      // clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        onLeave(stageRef.current)
        // As a result of onLeave the component could be unmounted before setStage runs!
        if (mountedRef.current) {
          setStage(stageRef.current + 1)
          runStage()
        }
      }, duration)
    }
  }

  function gotoStage(newStage: number) {
    clearTimeout(timeoutRef.current)
    setStage(newStage)
    runStage()
  }

  useEffect(() => {
    mountedRef.current = true
    runStage()

    return () => {
      mountedRef.current = false
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return [stage, gotoStage] as [number, (stage: number) => void]
}
