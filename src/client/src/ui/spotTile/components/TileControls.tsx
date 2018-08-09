import React from 'react'
import { PopoutIcon } from 'rt-components'
import { styled } from 'rt-util'
import { Environment } from '../../../system'

const TileControlsStyle = styled('div')`
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0px 6px;

  .spot-tile-container:hover & {
    opacity: 0.75;
  }

  svg {
    cursor: pointer;
  }

  .svg-icon {
    stroke: ${({ theme: { text } }) => text.textMeta};
    fill: ${({ theme: { text } }) => text.textMeta};
  }
`

const TopRightButton = styled('div')`
  .svg-icon {
    stroke: ${({ theme: { text } }) => text.textPrimary};
    fill: ${({ theme: { text } }) => text.textPrimary};
  }
`

interface Props {
  tornOff?: boolean
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
  </TileControlsStyle>
)

export default TileControls
