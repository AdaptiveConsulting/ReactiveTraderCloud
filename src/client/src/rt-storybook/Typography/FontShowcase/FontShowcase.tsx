import React from 'react'

import { styled } from 'rt-theme'

interface StyledFontShowcaseProps {
  font: string
  weight: string
  italic: boolean
}
const StyledFontShowcase = styled('div')<StyledFontShowcaseProps>`
  font-family: ${({ font }) => font};
  font-weight: ${({ weight }) => weight};
  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
  margin-bottom: 30px;
  margin-top: 30px;
  h2 {
    font-size: ${({ theme }) => theme.fontSize.h2};
  }
`

const FontSizes = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

interface FontSizeProps {
  fontSize: string
}
const FontSize = styled(`div`)<FontSizeProps>`
  display: flex;
  flex-direction: row;
  p {
    font-size: ${({ fontSize }) => fontSize};
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: left;
  }
  p:nth-child(1) {
    flex: 1;
    min-width: 250px;
  }
  p:nth-child(2) {
    flex: 4;
  }
`

interface Props {
  fontKey: string
  font: string
  fontSizes: Array<{
    name: string
    size: string
  }>
  sampleText: string
  fontWeight: string
  italic: boolean
}
const FontShowcase: React.SFC<Props> = ({ fontKey, font, fontSizes, fontWeight, sampleText, italic }) => (
  <StyledFontShowcase font={font} weight={fontWeight} italic={italic}>
    <h2>{`${fontKey.toUpperCase()} - ${font}`}</h2>
    <FontSizes>
      {fontSizes.map(({ name, size }) => (
        <FontSize key={size} fontSize={size}>
          <p>{`${name.toUpperCase()} ${size}`}</p>
          <p>{`${sampleText}`}</p>
        </FontSize>
      ))}
    </FontSizes>
  </StyledFontShowcase>
)

export default FontShowcase
