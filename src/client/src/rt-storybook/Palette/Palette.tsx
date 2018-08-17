import { withTheme } from 'emotion-theming'
import React from 'react'

import { Theme } from 'rt-themes'
import { styled } from 'rt-util'

import ColorGroup from './ColorGroup'

const StyledPalette = styled('div')`
  width: 100%;
  h1 {
    margin: 0px;
    font-size: ${({ theme }) => theme.fontSize.h1};
  }
  padding: 0px 20px;
  height: 100%;
  overflow-y: auto;
`

interface Props {
  theme?: Theme
}

const Palette: React.SFC<Props> = ({ theme }) => (
  <StyledPalette className="palette">
    <h1>Palette</h1>
    {Object.entries(theme.palette).map(([groupName, colors]) => (
      <ColorGroup
        key={groupName}
        name={groupName}
        colors={Object.entries(colors).map(([name, color]) => ({
          name,
          color
        }))}
      />
    ))}
  </StyledPalette>
)

export default withTheme(Palette)
