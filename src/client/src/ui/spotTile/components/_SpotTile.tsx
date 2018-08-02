import React from 'react'
import { Flex } from 'rt-components'
import { Direction, PriceMovementTypes } from 'rt-types'
import { styled } from 'rt-util'
import NotionalInput from './NotionalInput'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'
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
      <Flex direction="column" justifyContent="space-between" height="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <TileSymbol symbol="USD/JPY" />
          <DeliveryDate date="04 AUG" />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <PriceButton direction={Direction.Buy} big="33" pip="1" tenth="22" />
          <PriceMovement priceMovementType={PriceMovementTypes.Up} spread={{ formattedValue: '3.0' }} />
          <PriceButton direction={Direction.Sell} big="34" pip="2" tenth="22" />
        </Flex>
        <NotionalInput
          currencyPair={{
            base: 'USD',
            pipsPosition: 2,
            ratePrecision: 3,
            symbol: 'USDJPY',
            terms: 'JPY'
          }}
        />
      </Flex>
    </SpotTileStyle>
  )
}

export default _SpotTile
