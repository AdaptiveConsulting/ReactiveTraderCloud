import React from 'react'
import Color from 'tinycolor2'

import { styled } from 'rt-util'

const getBestTextColor = (
  background: string,
  colorOptions: {
    [color: string]: string
  }
) => {
  return Color.mostReadable(background, Object.values(colorOptions)).toHexString()
}

interface StyledProps {
  color: string
}
const StyledColorTile = styled('div')<StyledProps>`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
  transition: background-color ${({ theme }) => theme.animationSpeed.normal}ms;
  color: ${({ theme, color }) => getBestTextColor(color, theme.text)};
  transition: color ${({ theme }) => theme.animationSpeed.normal}ms;
  h3 {
    font-size: ${({ theme }) => theme.fontSize.h3};
    margin: 2px;
  }
  h4 {
    margin: 2px;
    font-size: ${({ theme }) => theme.fontSize.h4};
    text-transform: uppercase;
  }
`

interface Props {
  name: string
  color: string
}
const ColorTile: React.SFC<Props> = ({ name, color }: Props) => (
  <StyledColorTile color={color}>
    <h3>{name}</h3>
    <h4>{color}</h4>
  </StyledColorTile>
)

export default ColorTile
