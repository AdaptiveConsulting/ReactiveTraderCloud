import React from 'react'
import { PopoutIcon } from 'rt-components'
import { Environment } from 'rt-system'
import { styled } from 'rt-util'

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
        <PopoutIcon width={0.8125} height={0.75} />
      </TopRightButton>
    )}
  </TileControlsStyle>
)

export default TileControls
