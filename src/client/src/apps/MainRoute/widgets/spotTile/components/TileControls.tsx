import React, { useCallback } from 'react'
import { PopoutIcon, PopInIcon } from 'rt-components'
import { styled } from 'rt-theme'
import { usePlatform, platformHasFeature } from 'rt-platforms'

export const TopRightButton = styled('button')`
  position: absolute;
  right: 1rem;
  top: 0.995rem;
  opacity: 0;
  transition: opacity 0.2s;
  &:hover {
    .hover-state {
      fill: #5f94f5;
    }
  }
`

interface Props {
  canPopout?: boolean
  onPopoutClick?: (x: number, y: number) => void
}

const TileControls: React.FC<Props> = ({ onPopoutClick, canPopout }) => {
  const platform = usePlatform()

  const popoutClickHandler = useCallback(
    event => onPopoutClick && onPopoutClick(event.screenX, event.screenY),
    [onPopoutClick],
  )

  return (
    <React.Fragment>
      {canPopout ? (
        <TopRightButton onClick={popoutClickHandler} data-qa="tile-controls__popout-button">
          {PopoutIcon}
        </TopRightButton>
      ) : platformHasFeature(platform, 'allowPopIn') ? (
        <TopRightButton onClick={platform.window.close} data-qa="tile-controls__popin-button">
          {PopInIcon}
        </TopRightButton>
      ) : null}
    </React.Fragment>
  )
}
export default TileControls
