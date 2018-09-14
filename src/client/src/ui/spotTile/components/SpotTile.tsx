import numeral from 'numeral'
import React, { PureComponent } from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-theme'
import { ThemeProvider } from 'rt-theme'
import { CurrencyPair, Direction, ServiceConnectionStatus } from 'rt-types'
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
  executionStatus: ServiceConnectionStatus
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => void
}

interface State {
  notional: string
}

export default class SpotTile extends PureComponent<Props, State> {
  state = {
    notional: '1000000'
  }

  updateNotional = (notional: string) => this.setState({ notional })

  executeTrade = (direction: Direction, rawSpotRate: number) => {
    const { currencyPair, executeTrade } = this.props
    const notional = this.getNotional()
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional,
      rawSpotRate
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }

  getNotional = () => numeral(this.state.notional).value() || DEFAULT_NOTIONAL

  canExecute = () => {
    const { spotTileData, executionStatus } = this.props
    console.log(
      Boolean(
        executionStatus === ServiceConnectionStatus.CONNECTED &&
          !spotTileData.isTradeExecutionInFlight &&
          spotTileData.price
      )
    )
    return Boolean(
      executionStatus === ServiceConnectionStatus.CONNECTED &&
        !spotTileData.isTradeExecutionInFlight &&
        spotTileData.price
    )
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
              <PriceControls
                executeTrade={this.executeTrade}
                priceData={priceData}
                currencyPair={currencyPair}
                disabled={!this.canExecute()}
              />
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
