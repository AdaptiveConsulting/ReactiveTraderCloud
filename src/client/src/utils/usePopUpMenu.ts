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
    if (displayMenu) {
      document.addEventListener("click", hidePopUpMenu.current!)
    }

    return () => {
      document.removeEventListener("click", hidePopUpMenu.current!)
    }
  }, [displayMenu])

  return { displayMenu, setDisplayMenu }
}
