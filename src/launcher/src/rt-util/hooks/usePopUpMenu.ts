import { useCallback, useEffect, useState } from 'react'
import { isParentOf } from './'

export const usePopUpMenu = (ref: React.RefObject<HTMLDivElement>) => {
  const [displayMenu, setDisplayMenu] = useState(false)

  const hidePopUpMenu = useCallback((e: MouseEvent) => {
    const isClickInside = ref.current !== null && isParentOf(ref.current, e.target as HTMLElement)

    if (!isClickInside) {
      setDisplayMenu(false)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (displayMenu) {
      document.addEventListener('click', hidePopUpMenu)
    }

    return () => {
      document.removeEventListener('click', hidePopUpMenu)
    }
  }, [displayMenu, hidePopUpMenu])

  return { displayMenu, setDisplayMenu }
}
