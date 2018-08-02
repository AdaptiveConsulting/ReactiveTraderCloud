import React from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-util'
import { DeliveryDate, TileSymbol } from './Styled'

const SpotTileStyle = styled('div')`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  height: 100%;
  border-radius: 3px;
  padding: 20px;
  box-sizing: border-box;
`

const _SpotTile = () => {
  return (
    <SpotTileStyle>
      <Flex alignItems="center" justifyContent="space-between">
        <TileSymbol symbol="USD/JPY" />
        <DeliveryDate date="04 AUG" />
      </Flex>
    </SpotTileStyle>
  )
}

export default _SpotTile
