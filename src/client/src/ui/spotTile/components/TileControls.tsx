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

  .spot-tile:hover & {
    opacity: 1;
  }

  svg {
    cursor: pointer;
  }

  .svg-icon {
    stroke: ${({ theme: { text } }) => text.textMeta};
    fill: ${({ theme: { text } }) => text.textMeta};
  }
`

const TileControl = styled(Circle)`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};

  &:hover {
    background-color: ${({ theme: { palette } }) => palette.accentPrimary.normal};

    .svg-icon {
      stroke: ${({ theme: { text } }) => text.textPrimary};
      fill: ${({ theme: { text } }) => text.textPrimary};
    }
  }
`

const TopRightButton = styled(TileControl)`
  position: absolute;
  right: -17px;
  top: -17px;
`

const BottomRightButton = styled(TileControl)`
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
