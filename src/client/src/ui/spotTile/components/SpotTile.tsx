import numeral from 'numeral'
import React, { Component } from 'react'
import { Flex } from 'rt-components'
import { CurrencyPair, Direction } from 'rt-types'
import { styled } from 'rt-util'
import { spotDateFormatter } from '../model/dateUtils'
import { SpotTileData } from '../model/spotTileData'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import { DeliveryDate, TileBaseStyle, TileSymbol } from './Styled'

const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
`

const SpotTileWrapper = styled('div')`
  position: relative;
  min-height: 150px;
  overflow: hidden;
`

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executeTrade: (direction: Direction, notional: number) => void
}

interface State {
  notional: string
}

export default class SpotTile extends Component<Props, State> {
  state = {
    notional: '1000000'
  }

  updateNotional = (notional: string) => this.setState({ notional })

  executeTrade = (direction: Direction) => this.props.executeTrade(direction, numeral(this.state.notional).value())

  render() {
    const { currencyPair, spotTileData, children } = this.props
    const { notional } = this.state

    const priceData = spotTileData && spotTileData.price
    const spotDate = priceData && spotDateFormatter(priceData.valueDate, false).toUpperCase()

    return (
      <SpotTileWrapper className="_spot-tile">
        {children}
        <SpotTileStyle>
          <Flex direction="column" justifyContent="space-between" height="100%">
            <Flex alignItems="center" justifyContent="space-between">
              <TileSymbol>{`${currencyPair.base}/${currencyPair.terms}`}</TileSymbol>
              <DeliveryDate className="delivery-date">{spotDate && `SPT (${spotDate})`} </DeliveryDate>
            </Flex>
            <PriceControls executeTrade={this.executeTrade} priceData={priceData} currencyPair={currencyPair} />
            <NotionalInput
              notional={notional}
              currencyPairSymbol={currencyPair.base}
              updateNotional={this.updateNotional}
            />
          </Flex>
        </SpotTileStyle>
      </SpotTileWrapper>
    )
  }
}
