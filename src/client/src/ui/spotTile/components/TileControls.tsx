import React from 'react'
import { ExpandIcon, PopoutIcon } from 'rt-components'
import { styled } from 'rt-util'
import { Environment } from '../../../system'
import { Circle } from './Styled'

const TileControlsStyle = styled('div')`
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s;

  svg {
    cursor: pointer;
  }

  .svg-icon {
    stroke: ${({ theme: { text } }) => text.textMeta};
    fill: ${({ theme: { text } }) => text.textMeta};
  }

  ._spot-tile:hover & {
    opacity: 1;
  }
`

const TopRightButton = styled(Circle)`
  position: absolute;
  right: -17px;
  top: -17px;
`

const BottomRightButton = styled(Circle)`
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
        <TopRightButton onClick={onPopoutClick}>
          <PopoutIcon />
        </TopRightButton>
      )}
    <BottomRightButton>
      <ExpandIcon />
    </BottomRightButton>
  </TileControlsStyle>
)

export default TileControls
