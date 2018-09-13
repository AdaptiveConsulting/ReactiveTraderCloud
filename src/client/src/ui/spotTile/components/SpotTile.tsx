import numeral from 'numeral'
import React, { PureComponent } from 'react'
import { Action } from 'redux'
import { Flex } from 'rt-components'
import { styled } from 'rt-theme'
import { ThemeProvider } from 'rt-theme'
import { CurrencyPair, Direction } from 'rt-types'
import { createTradeRequest, DEFAULT_NOTIONAL, ExecuteTradeRequest, SpotTileData, TradeRequest } from '../model'
import { spotDateFormatter } from '../model/dateUtils'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import { DeliveryDate, TileBaseStyle, TileSymbol } from './styled'

export const SpotTileWrapper = styled('div')`
  position: relative;
  min-height: 10rem;
  height: 100%;
  color: ${({ theme }) => theme.tile.textColor};
`

export const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.backgroundColor};
`

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => Action
}

interface State {
  notional: string
}

export default class SpotTile extends PureComponent<Props, State> {
  state = {
    notional: '1000000'
  }

  updateNotional = (notional: string) => this.setState({ notional })

  createTrade = (direction: Direction) => {
    const { spotTileData, currencyPair, executeTrade } = this.props
    if (spotTileData.isTradeExecutionInFlight || !spotTileData.price) {
      return
    }
    const notional = numeral(this.state.notional).value() || DEFAULT_NOTIONAL
    const rawSpotRate = direction === Direction.Buy ? spotTileData.price.ask : spotTileData.price.bid
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional,
      rawSpotRate
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }

  render() {
    const { currencyPair, spotTileData, children } = this.props
    const { notional } = this.state

    const priceData = spotTileData && spotTileData.price
    const spotDate = priceData && spotDateFormatter(priceData.valueDate, false).toUpperCase()

    return (
      <ThemeProvider theme={theme => theme.tile}>
        <SpotTileWrapper>
          <SpotTileStyle className="spot-tile">
            <Flex direction="column" justifyContent="space-between" height="100%">
              <Flex alignItems="center" justifyContent="space-between">
                <TileSymbol>{`${currencyPair.base}/${currencyPair.terms}`}</TileSymbol>
                <DeliveryDate className="delivery-date">{spotDate && `SPT (${spotDate})`} </DeliveryDate>
              </Flex>
              <PriceControls executeTrade={this.createTrade} priceData={priceData} currencyPair={currencyPair} />
              <NotionalInput
                notional={notional}
                currencyPairSymbol={currencyPair.base}
                updateNotional={this.updateNotional}
              />
            </Flex>
          </SpotTileStyle>
          {children}
        </SpotTileWrapper>
      </ThemeProvider>
    )
  }
}
