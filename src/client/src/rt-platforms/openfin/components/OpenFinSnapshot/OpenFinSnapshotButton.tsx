import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createOpenFinPopup, Offset, showOpenFinPopup } from '../utils'
import { Button, Root } from './styled'

const OpenFinSnapshotButton: React.FC = () => {
  const [showing, setShowing] = useState(false)

  const baseWin = useMemo(() => {
    return { name: 'openfin-snapshot-popup', height: 249, width: 245 }
  }, [])

  const offset: Offset = useMemo(() => [119, 40], [])

  const URL = '/snapshots'

  const showPopup = useCallback(() => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(baseWin, offset)
    }
  }, [baseWin, offset, showing])

  useEffect(() => {
    createOpenFinPopup(baseWin, URL, () => setShowing(false))
  }, [baseWin])

  return (
    <Root>
      <Button onMouseDown={showPopup} data-qa="snapshots-button__toggle-button">
        {'Snapshots'}
      </Button>
    </Root>
  )
}

export default OpenFinSnapshotButton
