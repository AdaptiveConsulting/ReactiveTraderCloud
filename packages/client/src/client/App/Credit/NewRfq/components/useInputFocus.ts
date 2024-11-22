import { useCallback, useRef } from "react"

export const useInputFocus = () => {
  const shouldFocusInputOnMount = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>()

  const inputRefCallback = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
    if (node && shouldFocusInputOnMount.current) {
      node.focus()
      shouldFocusInputOnMount.current = false
    }
  }, [])

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    } else {
      shouldFocusInputOnMount.current = true
    }
  }, [])

  return { inputRef: inputRefCallback, focusInput }
}
