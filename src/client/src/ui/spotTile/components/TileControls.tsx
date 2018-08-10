import React from 'react'
import { PopoutIcon } from 'rt-components'
import { styled } from 'rt-util'
import { Environment } from '../../../system'

const TileControlsStyle = styled('div')`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0 0.375rem;

  .spot-tile-container:hover & {
    opacity: 0.75;
  }
`

const TopRightButton = styled('div')`
  cursor: pointer;

  .svg-icon {
    stroke: ${({ theme: { text } }) => text.textPrimary};
    fill: ${({ theme: { text } }) => text.textPrimary};
  }
`

interface Props {
  onPopoutClick?: () => void
}

const TileControls: React.SFC<Props> = ({ onPopoutClick }) => (
  <TileControlsStyle>
    {!Environment.isRunningInIE() && (
      <TopRightButton onClick={onPopoutClick}>
        <PopoutIcon />
      </TopRightButton>
    )}
  </TileControlsStyle>
)

export default TileControls
