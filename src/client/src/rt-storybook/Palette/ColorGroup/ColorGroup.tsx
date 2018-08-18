import React from 'react'

import { styled } from 'rt-theme'

import ColorTile from './ColorTile'

const StyledColorGroup = styled('div')`
  display: flex;
  flex-direction: column;
  h2 {
    font-size: ${({ theme }) => theme.fontSize.h2};
  }
`

const Colors = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

interface Props {
  name: string
  colors: Array<{
    name: string
    color: string
  }>
}
const ColorGroup: React.SFC<Props> = ({ name: groupName, colors }) => (
  <StyledColorGroup>
    <h2>{groupName}</h2>
    <Colors>
      {colors.map(({ name, color }) => (
        <ColorTile key={name} name={name} color={color} />
      ))}
    </Colors>
  </StyledColorGroup>
)

export default ColorGroup
