import React from 'react'
import { styled } from 'rt-util'
import { Environment } from '../../../system'
import { IconButton } from './Styled'

const TileControlsStyle = styled('div')`
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s;

  i {
    cursor: pointer;
  }

  ._spot-tile:hover & {
    opacity: 1;
  }
`

const TopRightButton = styled('div')`
  position: absolute;
  right: -17px;
  top: -17px;
`

const BottomRightButton = styled('div')`
  position: absolute;
  right: -17px;
  bottom: -17px;
`

interface Props {
  tornOff: boolean
  onPopoutClick?: () => void
}

const TileControls = ({ tornOff, onPopoutClick }: Props) => (
  <TileControlsStyle>
    {!Environment.isRunningInIE() &&
      !tornOff && (
        <TopRightButton>
          <IconButton icon="fas fa-external-link-square-alt" handleClick={onPopoutClick} />
        </TopRightButton>
      )}
    <BottomRightButton>
      <IconButton icon="fas fa-expand" />
    </BottomRightButton>
  </TileControlsStyle>
)

export default TileControls
