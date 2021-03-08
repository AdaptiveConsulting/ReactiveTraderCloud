import { useEffect, useState } from "react"

export const useHasItBeenVisible = <T extends HTMLElement>(
  ref: React.RefObject<T>,
) => {
  const [isVisible, setIsvisible] = useState(false)
  useEffect(() => {
    const onResize = () => {
      if (ref.current && ref.current.getBoundingClientRect().width > 0) {
        setIsvisible(true)
        window.removeEventListener("resize", onResize)
      }
    }

    window.addEventListener("resize", onResize)
    onResize()
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [ref])
  return isVisible
}
