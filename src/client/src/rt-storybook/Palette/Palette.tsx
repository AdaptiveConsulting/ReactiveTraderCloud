import { withTheme } from 'emotion-theming'
import React from 'react'

import { styled } from 'rt-util'
import { Theme } from 'ui/theme/themes'

import ColorGroup from './ColorGroup'

const StyledPalette = styled('div')`
  width: 100%;
  flex: 1;
  background-color: ${({ theme }) => theme.palette.fixed.white};
  h1 {
    margin: 0px;
    font-size: ${({ theme }) => theme.fontSize.h1};
  }
  overflow-y: scroll;
  padding: 0px 20px;
`

interface Props {
  theme?: Theme
}

const Palette: React.SFC<Props> = ({ theme }) => (
  <StyledPalette>
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
