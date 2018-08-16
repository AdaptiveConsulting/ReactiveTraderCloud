import numeral from 'numeral'
import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import { Flex } from 'rt-components'
import { ThemeProvider } from 'rt-theme'
import { CurrencyPair, Direction } from 'rt-types'
import { spotDateFormatter } from '../model/dateUtils'
import { SpotTileData } from '../model/spotTileData'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import { DeliveryDate, TileBaseStyle, TileSymbol } from './styled'

const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.backgroundColor};
`

const SpotTileWrapper = styled('div')`
  position: relative;
  min-height: 160px;
  height: 100%;
`

export interface Props {
  currencyPair: CurrencyPair
  spotTileData: SpotTileData
  executeTrade: (direction: Direction, notional: number) => void
}

interface State {
  notional: string
}

export default class SpotTile extends PureComponent<Props, State> {
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
      <ThemeProvider theme={theme => theme.tile}>
        <SpotTileWrapper className="spot-tile-container">
          <SpotTileStyle className="spot-tile">
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
          {children}
        </SpotTileWrapper>
      </ThemeProvider>
    )
  }
}
