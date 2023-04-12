import { useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"

/**
 * React router doesn't scroll to hash elements.  This has been solved by the
 * library react-router-hash-link, but it's not working with react-router v6.
 * This code is adapted from https://github.com/ncoughlin/scroll-to-hash-element
 */
export const useScrollToHashElement = () => {
  const location = useLocation()

  const hashElement = useMemo(() => {
    const hash = location.hash
    const removeHashCharacter = (str: string) => {
      const result = str.slice(1)
      return result
    }

    if (hash) {
      const element = document.getElementById(removeHashCharacter(hash))
      return element
    } else {
      return null
    }
  }, [location])

  useEffect(() => {
    if (hashElement) {
      hashElement.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "start",
      })
    }
  }, [hashElement])
}
