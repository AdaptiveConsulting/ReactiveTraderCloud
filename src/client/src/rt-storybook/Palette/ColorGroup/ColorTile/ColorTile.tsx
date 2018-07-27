import React from 'react'
import Color from 'tinycolor2'

import { styled } from 'rt-util'

interface StyledProps {
  color: string
  isLight: boolean
}
const StyledColorTile = styled('div')<StyledProps>`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
  transition: background-color 0.3s;
  color: ${({ theme, isLight }) => (isLight ? theme.palette.fixed.black : theme.palette.fixed.white)};
  transition: color 0.3s;
  h3 {
    font-size: ${({ theme }) => theme.fontSize.h3};
    margin: 2px;
  }
  h4 {
    margin: 2px;
    font-size: ${({ theme }) => theme.fontSize.h4};
  }
`

interface Props {
  name: string
  color: string
}
const ColorTile: React.SFC<Props> = ({ name, color }: Props) => (
  <StyledColorTile color={color} isLight={Color(color).isLight()}>
    <h3>{name.toUpperCase()}</h3>
    <h4>{color.toUpperCase()}</h4>
  </StyledColorTile>
)

export default ColorTile
