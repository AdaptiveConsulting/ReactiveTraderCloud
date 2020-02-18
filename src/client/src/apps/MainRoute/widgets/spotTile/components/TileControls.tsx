import React, { useCallback } from 'react'
import { PopoutIcon } from 'rt-components'
import { styled } from 'rt-theme'

export const TopRightButton = styled('button')`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;
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
  const popoutClickHandler = useCallback(
    event => onPopoutClick && onPopoutClick(event.screenX, event.screenY),
    [onPopoutClick],
  )

  return (
    <React.Fragment>
      {canPopout && (
        <TopRightButton onClick={popoutClickHandler} data-qa="tile-controls__popout-button">
          {PopoutIcon}
        </TopRightButton>
      )}
    </React.Fragment>
  )
}
export default TileControls
