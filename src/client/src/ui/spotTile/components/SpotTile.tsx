import React, { PureComponent, FC } from 'react'
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
import { usePlatform } from 'rt-components'
import RfqTimer from './RfqTimer'
import styled from 'styled-components'

const TileHeaderWrapper = styled.div`
  display: block;
  margin-bottom: 15px;
`

const SpotTileWrapperWithPlatform: FC = props => {
  const platform = usePlatform()
  return <SpotTileWrapper {...props} platform={platform} />
}

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
    } = this.props

    const spotDate = spotDateFormatter(price.valueDate, false).toUpperCase()
    const date = spotDate && `SPT (${spotDate})`
    const baseTerm = `${currencyPair.base}/${currencyPair.terms}`
    const handleRfqRejected = () => rfq.reject({ currencyPair })
    const showResetButton = rfqState === 'canRequest' || rfqState === 'expired'
    const showTimer = rfqState === 'received' && rfqTimeout
    const priceData = rfqState === 'received' || rfqState === 'expired' ? rfqPrice : price

    return (
      <SpotTileWrapperWithPlatform>
        <SpotTileStyle className="spot-tile">
          <ReserveSpaceGrouping>
            <TileHeaderWrapper>
              <TileHeader baseTerm={baseTerm} date={date} />
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
                currencyPairSymbol={currencyPair.base}
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
      </SpotTileWrapperWithPlatform>
    )
  }
}
