import { useEffect, useState } from "react"

import { isLayoutLocked } from "../utils/layout"
import { LockedIcon } from "./LockedIcon"
import { UnlockedIcon } from "./UnlockedIcon"

export const PlatformLockedStatusIcon = () => {
  const [locked, setLocked] = useState(false)

  const updateLocked = async () => {
    const locked = await isLayoutLocked()
    setLocked(locked)
  }

  useEffect(() => {
    updateLocked()
    // fin.me is currently undocumented
    const currentWindow = fin.Window.getCurrentSync()
    const onLayoutReady = async () => updateLocked()

    currentWindow.on("layout-ready", onLayoutReady)

    return () => {
      currentWindow.removeListener("layout-ready", onLayoutReady)
    }
  }, [])

  return locked ? <LockedIcon /> : <UnlockedIcon />
}
