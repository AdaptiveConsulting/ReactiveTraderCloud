import { useEffect } from "react"

export const useMoveNextOnEnter = (onNext: () => void) => {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.repeat) {
        onNext()
      }
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])
}
