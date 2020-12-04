import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createOpenFinPopup, Offset, showOpenFinPopup } from '../utils'
import { Button, Root } from './styled'
import PlatformLockedStatusIcon from '../PlatformLockedStatusIcon'

const OpenFinSnapshotButton: React.FC = () => {
  const [showing, setShowing] = useState(false)

  const baseWin = useMemo(() => {
    return { name: 'snapshots', height: 249, width: 245 }
  }, [])

  const offset: Offset = useMemo(() => [119, 40], [])

  const pathname = '/snapshots'

  const showPopup = useCallback(() => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(baseWin, offset)
    }
  }, [baseWin, offset, showing])

  useEffect(() => {
    createOpenFinPopup(baseWin, pathname, () => setShowing(false))
  }, [baseWin])

  return (
    <Root>
      <Button onMouseDown={showPopup} data-qa="snapshots-button__toggle-button">
        <PlatformLockedStatusIcon />
        &nbsp;&nbsp;
        {'Snapshots'}
      </Button>
    </Root>
  )
}

export default OpenFinSnapshotButton
