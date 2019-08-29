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

  .svg-icon {
    stroke: ${({ theme }) => theme.core.textColor};
    fill: ${({ theme }) => theme.core.textColor};
  }
`

interface Props {
  canPopout?: boolean
  onPopoutClick?: (x: number, y: number) => void
}

const TileControls: React.FC<Props> = ({ onPopoutClick, canPopout }) => {
  const popoutClickHandler = useCallback(
    event => {
      onPopoutClick(event.screenX, event.screenY)
    },
    [onPopoutClick],
  )

  return (
    <React.Fragment>
      {canPopout && (
        <TopRightButton onClick={popoutClickHandler}>
          <PopoutIcon width={0.8125} height={0.75} />
        </TopRightButton>
      )}
    </React.Fragment>
  )
}
export default TileControls
