import React from 'react'
import { PopoutIcon } from 'rt-components'
import { Header, Controls, PopoutButton, Title } from './styled'

interface AnalyticsHeaderProps {
  canPopout: boolean
  onPopoutClick: (() => void) | undefined
}

const AnalyticsHeader: React.SFC<AnalyticsHeaderProps> = ({ canPopout, onPopoutClick }) => (
  <Header>
    {canPopout && (
      <Controls>
        <PopoutButton onClick={onPopoutClick}>
          <PopoutIcon width={0.8125} height={0.75} />
        </PopoutButton>
      </Controls>
    )}
    <Title>Profit &amp; Loss</Title>
  </Header>
)

export default AnalyticsHeader
