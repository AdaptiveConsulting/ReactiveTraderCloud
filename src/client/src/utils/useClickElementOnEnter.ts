import { useCallback, useEffect, useRef } from "react"

export const useClickElementOnEnter = <T extends HTMLElement>() => {
  const clickElementRef = useRef<T>(null)

  const listener = useCallback((event: KeyboardEvent) => {
    if (event.key === "Enter") {
      clickElementRef.current?.click()
    }
  }, [])

  useEffect(() => {
    addEventListener("keypress", listener)
    return () => {
      removeEventListener("keypress", listener)
    }
  }, [listener])

  return clickElementRef
}
