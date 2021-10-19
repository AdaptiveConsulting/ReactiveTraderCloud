import { useState, useEffect, useCallback, useMemo } from "react"

export const useLocalStorage = <T>(key: string, initialState: T) => {
  const [state, setState] = useState(() => {
    return window.localStorage.getItem(key) ?? JSON.stringify(initialState)
  })

  useEffect(() => {
    const updateState = () => {
      setState(window.localStorage.getItem(key) ?? JSON.stringify(initialState))
    }

    updateState()

    window.addEventListener("storage", updateState)

    return () => {
      window.removeEventListener("storage", updateState)
    }
  }, [key, initialState])

  useEffect(() => {
    window.localStorage.setItem(key, state)
  }, [key, state])

  const value = useMemo(() => {
    try {
      return JSON.parse(state)
    } catch (e) {
      return state
    }
  }, [state])
  const setter = useCallback((valueOrCallback: T | ((value: T) => T)) => {
    valueOrCallback instanceof Function
      ? setState((prev) => JSON.stringify(valueOrCallback(JSON.parse(prev))))
      : setState(JSON.stringify(valueOrCallback))
  }, [])

  return [value, setter]
}
