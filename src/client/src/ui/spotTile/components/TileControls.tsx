import React from 'react'
import { PlatformAdapter, PopoutIcon, withPlatform } from 'rt-components'
import { styled } from 'rt-theme'
import { SpotTileWrapper } from './SpotTile'

const TopRightButton = styled('button')`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;

  ${SpotTileWrapper}:hover & {
    opacity: 0.75;
  }
  .svg-icon {
    stroke: ${({ theme }) => theme.tile.textColor};
    fill: ${({ theme }) => theme.tile.textColor};
  }
`

const BottomRightButton = styled('button')`
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;

  ${SpotTileWrapper}:hover & {
    opacity: 0.75;
  }
`

interface Props {
  canPopout?: boolean
  onPopoutClick?: () => void
  displayCurrencyChart?: () => void
}

const TileControls: React.SFC<Props & { platform: PlatformAdapter }> = ({
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
