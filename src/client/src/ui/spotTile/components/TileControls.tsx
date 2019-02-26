import React from 'react'
import { PopoutIcon, usePlatform } from 'rt-components'
import { styled } from 'rt-theme'
import { TileWrapper } from './styled'

export const TopRightButton = styled('button')`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;

  ${TileWrapper}:hover & {
    opacity: 0.75;
  }

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

  ${TileWrapper}:hover & {
    opacity: 0.75;
  }
`

interface Props {
  canPopout?: boolean
  onPopoutClick?: () => void
  displayCurrencyChart?: () => void
}

const TileControls: React.FC<Props> = ({ onPopoutClick, canPopout, displayCurrencyChart }) => {
  const platform = usePlatform()
  return (
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
}

export default TileControls
