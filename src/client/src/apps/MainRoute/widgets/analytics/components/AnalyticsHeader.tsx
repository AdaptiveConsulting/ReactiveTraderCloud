import React, { useCallback } from 'react'
import { PopoutIcon } from 'rt-components'
import { Controls, PopoutButton } from './styled'

interface AnalyticsHeaderProps {
  canPopout: boolean
  onPopoutClick: ((x: number, y: number) => void) | undefined
}

const AnalyticsWindowHeader: React.FC<AnalyticsHeaderProps> = ({ canPopout, onPopoutClick }) => {
  const popoutClickHandler = useCallback(
    event => {
      onPopoutClick(event.screenX, event.screenY)
    },
    [onPopoutClick],
  )

  return canPopout ? (
    <Controls>
      <PopoutButton onClick={popoutClickHandler} data-qa="analytics-header__popout-button">
        <PopoutIcon width={0.8125} height={0.75} />
      </PopoutButton>
    </Controls>
  ) : null
}

export default AnalyticsWindowHeader
