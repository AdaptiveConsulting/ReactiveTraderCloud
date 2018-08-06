import React from 'react'
import { styled } from 'rt-util'
import { IconButton } from './Styled'

const TileControlsStyle = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;

  i {
    cursor: pointer;
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

const TileControls = () => {
  return (
    <TileControlsStyle>
      <TopRightButton>
        <IconButton icon="fas fa-external-link-square-alt" />
      </TopRightButton>
      <BottomRightButton>
        <IconButton icon="fas fa-expand" />
      </BottomRightButton>
    </TileControlsStyle>
  )
}

export default TileControls
