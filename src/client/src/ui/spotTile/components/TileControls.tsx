import React from 'react'
import { EnvironmentValue, PopoutIcon, withEnvironment } from 'rt-components'
import { Environment } from 'rt-system'
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
    stroke: ${({ theme }) => theme.textColor};
    fill: ${({ theme }) => theme.textColor};
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

const TileControls: React.SFC<Props & { environment: EnvironmentValue }> = ({
  onPopoutClick,
  canPopout = false,
  environment,
  displayCurrencyChart
}) => (
  <React.Fragment>
    {!canPopout &&
      !Environment.isRunningInIE() && (
        <TopRightButton onClick={onPopoutClick}>
          <PopoutIcon width={0.8125} height={0.75} />
        </TopRightButton>
      )}
    {environment.isDesktop && (
      <BottomRightButton onClick={displayCurrencyChart}>
        <i className="fas fa-chart-bar" />
      </BottomRightButton>
    )}
  </React.Fragment>
)

export default withEnvironment(TileControls)
