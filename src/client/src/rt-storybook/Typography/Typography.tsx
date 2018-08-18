import { withTheme } from 'emotion-theming'
import React from 'react'

import { styled } from 'rt-theme'
import { Theme } from 'rt-themes'

import FontShowcase from './FontShowcase'

const StyledTypography = styled('div')`
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
  sampleText: string
  fontWeight: string
  italic: boolean
}
const Typography: React.SFC<Props> = ({ theme, sampleText, fontWeight, italic }) => (
  <StyledTypography>
    <h1>Typography</h1>
    {Object.entries(theme.fontFamily).map(([fontKey, font]) => (
      <FontShowcase
        key={fontKey}
        fontKey={fontKey}
        font={font}
        fontSizes={Object.entries(theme.fontSize).map(([name, size]) => ({ name, size }))}
        sampleText={sampleText}
        fontWeight={fontWeight}
        italic={italic}
      />
    ))}
  </StyledTypography>
)

export default withTheme(Typography)
