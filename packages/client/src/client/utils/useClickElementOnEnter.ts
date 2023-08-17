import { useCallback, useEffect, useRef } from "react"

export const useClickElementOnEnter = <T extends HTMLElement>(
  active = true,
) => {
  const clickElementRef = useRef<T>(null)

  const listener = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" && active) {
        clickElementRef.current?.click()
      }
    },
    [active],
  )

  useEffect(() => {
    addEventListener("keypress", listener)
    return () => {
      removeEventListener("keypress", listener)
    }
  }, [listener])

  return clickElementRef
}
