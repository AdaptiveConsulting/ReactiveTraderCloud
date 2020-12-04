import React, { useEffect, useState } from 'react'
import { isLayoutLocked } from './utils'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'

library.add(faLock, faUnlock)
export const UnlockedIcon = () => <FontAwesomeIcon icon="unlock" />
export const LockedIcon = () => <FontAwesomeIcon icon="lock" />

const PlatformLockedStatusIcon = () => {
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

    currentWindow.on('layout-ready', onLayoutReady)

    return () => {
      currentWindow.removeListener('layout-ready', onLayoutReady)
    }
  }, [])

  return locked ? <LockedIcon /> : <UnlockedIcon />
}

export default PlatformLockedStatusIcon
