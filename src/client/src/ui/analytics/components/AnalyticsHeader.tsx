import React from 'react'
import { PopoutIcon } from 'rt-components'
import { Controls, PopoutButton } from './styled'

interface AnalyticsHeaderProps {
  canPopout: boolean
  onPopoutClick: (() => void) | undefined
}

const AnalyticsWindowHeader: React.SFC<AnalyticsHeaderProps> = ({ canPopout, onPopoutClick }) =>
  canPopout ? (
    <Controls>
      <PopoutButton onClick={onPopoutClick}>
        <PopoutIcon width={0.8125} height={0.75} />
      </PopoutButton>
    </Controls>
  ) : null

export default AnalyticsWindowHeader
