import { useEffect, useRef, useState } from "react"

const isParentOf = (
  parent: HTMLElement,
  child: HTMLElement | null,
): boolean => {
  if (child === null) {
    return false
  }
  if (child === parent) {
    return true
  }
  return isParentOf(parent, child.parentElement)
}

export const usePopUpMenu = <T extends HTMLElement>(
  ref: React.RefObject<T>,
) => {
  const [displayMenu, setDisplayMenu] = useState(false)
  const hidePopUpMenu = useRef<(e: MouseEvent) => void>()
  if (!hidePopUpMenu.current) {
    hidePopUpMenu.current = (e: MouseEvent) => {
      const isClickInside =
        ref.current !== null && isParentOf(ref.current, e.target as HTMLElement)

      if (!isClickInside) {
        setDisplayMenu(false)
      }
    }
  }

  useEffect(() => {
    /**
     * Wrapping in setTimeout is a workaround to solve this change introduced by
     * React 18 - https://github.com/facebook/react/issues/23097
     */
    setTimeout(() => {
      if (displayMenu && hidePopUpMenu.current) {
        document.addEventListener("click", hidePopUpMenu?.current)
      }
    }, 0)
    return () => {
      hidePopUpMenu.current &&
        document.removeEventListener("click", hidePopUpMenu.current)
    }
  }, [displayMenu])

  return { displayMenu, setDisplayMenu }
}
