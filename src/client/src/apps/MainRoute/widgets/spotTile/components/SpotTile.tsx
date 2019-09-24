import React, { PureComponent } from 'react'
import { spotDateFormatter } from '../model/dateUtils'
import NotionalInput from './notional'
import PriceControls from './PriceControls'
import TileHeader from './TileHeader'
import {
  NotionalInputWrapper,
  SpotTileWrapper,
  SpotTileStyle,
  ReserveSpaceGrouping,
} from './styled'
import { Props } from './types'
import RfqTimer from './RfqTimer'
import styled from 'styled-components'
import { getConstsFromRfqState } from '../model/spotTileUtils'

const TileHeaderWrapper = styled.div`
  display: block;
  margin-bottom: 15px;
`

export default class SpotTile extends PureComponent<Props> {
  render() {
    const {
      currencyPair,
      spotTileData: { price, rfqState, rfqPrice, rfqTimeout },
      notional,
      updateNotional,
      resetNotional,
      executeTrade,
      children,
      tradingDisabled,
      inputDisabled,
      inputValidationMessage,
      rfq,
      displayCurrencyChart,
    } = this.props

    const spotDate = price.valueDate && spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const handleRfqRejected = () => rfq.reject({ currencyPair })
    const { isRfqStateReceived, isRfqStateExpired, isRfqStateCanRequest } = getConstsFromRfqState(
      rfqState,
    )
    const showResetButton = isRfqStateCanRequest || isRfqStateExpired
    const showTimer = isRfqStateReceived && rfqTimeout
    const priceData = isRfqStateReceived || isRfqStateExpired ? rfqPrice : price

    return (
      <SpotTileWrapper>
        <SpotTileStyle
          className="spot-tile"
          data-qa="spot-tile__tile"
          data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
        >
          <ReserveSpaceGrouping>
            <TileHeaderWrapper>
              <TileHeader
                ccyPair={currencyPair}
                date={date}
                displayCurrencyChart={displayCurrencyChart}
              />
            </TileHeaderWrapper>
            <PriceControls
              executeTrade={executeTrade}
              priceData={priceData}
              currencyPair={currencyPair}
              rfqState={rfqState}
              disabled={tradingDisabled}
            />
          </ReserveSpaceGrouping>
          <ReserveSpaceGrouping>
            <NotionalInputWrapper>
              <NotionalInput
                notional={notional}
                currencyPairBase={currencyPair.base}
                currencyPairSymbol={currencyPair.symbol}
                updateNotional={updateNotional}
                resetNotional={resetNotional}
                validationMessage={inputValidationMessage}
                showResetButton={showResetButton}
                disabled={inputDisabled}
              />
            </NotionalInputWrapper>
            {showTimer && <RfqTimer onRejected={handleRfqRejected} timeout={rfqTimeout} />}
          </ReserveSpaceGrouping>
        </SpotTileStyle>
        {children}
      </SpotTileWrapper>
    )
  }
}
