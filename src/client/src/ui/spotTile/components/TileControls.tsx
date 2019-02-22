import React from 'react'
import { PlatformAdapter, PopoutIcon, withPlatform } from 'rt-components'
import { styled } from 'rt-theme'

export const TopRightButton = styled('button')`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;

  .svg-icon {
    stroke: ${({ theme }) => theme.core.textColor};
    fill: ${({ theme }) => theme.core.textColor};
  }
`

export const BottomRightButton = styled('button')`
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;
`

interface Props {
  canPopout?: boolean
  onPopoutClick?: () => void
  displayCurrencyChart?: () => void
}

const TileControls: React.FC<Props & { platform: PlatformAdapter }> = ({
  onPopoutClick,
  canPopout,
  platform,
  displayCurrencyChart,
}) => (
  <React.Fragment>
    {canPopout && (
      <TopRightButton onClick={onPopoutClick}>
        <PopoutIcon width={0.8125} height={0.75} />
      </TopRightButton>
    )}
    {platform.type !== 'browser' && (
      <BottomRightButton onClick={displayCurrencyChart}>
        <i className="fas fa-chart-bar" />
      </BottomRightButton>
    )}
  </React.Fragment>
)

export default withPlatform(TileControls)
