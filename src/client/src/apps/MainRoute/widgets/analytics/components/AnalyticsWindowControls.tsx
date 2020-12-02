import React, { useCallback } from 'react'
import { PopoutIcon } from 'rt-components'
import { PopoutButton } from 'rt-components/styled'
import { Controls } from './styled'

interface AnalyticsHeaderProps {
  canPopout: boolean
  onPopoutClick?: (x: number, y: number) => void
}

const AnalyticsWindowControls: React.FC<AnalyticsHeaderProps> = ({ canPopout, onPopoutClick }) => {
  const popoutClickHandler = useCallback(
    event => {
      onPopoutClick && onPopoutClick(event.screenX, event.screenY)
    },
    [onPopoutClick]
  )

  return canPopout ? (
    <Controls>
      <PopoutButton onClick={popoutClickHandler} data-qa="analytics-header__popout-button">
        {PopoutIcon}
      </PopoutButton>
    </Controls>
  ) : null
}

export default AnalyticsWindowControls
