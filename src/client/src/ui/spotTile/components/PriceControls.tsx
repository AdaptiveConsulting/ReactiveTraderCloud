import React from 'react'
import { styled } from 'rt-theme'
import { CurrencyPair, Direction } from 'rt-types'
import { SpotPriceTick } from '../model/spotPriceTick'
import { getSpread, toRate } from '../model/spotTileUtils'
import PriceButton from './PriceButton'
import PriceMovement from './PriceMovement'
import { RfqState } from './types'
import { AdaptiveLoader } from 'rt-components'

const PriceControlsStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface Props {
  currencyPair: CurrencyPair
  priceData: SpotPriceTick
  executeTrade: (direction: Direction, rawSpotRate: number) => void
  disabled: boolean
  rfqState: RfqState
}

const PriceButtonDisabledPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  font-size: 10px;
  transition: background-color 0.2s ease;
  height: 58px;
  line-height: normal;
  min-width: 126.13px;
  opacity: 0.5;
  text-align: center;
  text-transform: uppercase;
`

const Icon = styled.i`
  font-size: 20px;
  margin: 3px 0;
`

const AdaptiveLoaderWrapper = styled.div`
  margin: -5px 0 3px;
`

const PriceControls: React.FC<Props> = ({
  currencyPair,
  priceData,
  executeTrade,
  rfqState,
  disabled,
}) => {
  const bidRate = toRate(priceData.bid, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const askRate = toRate(priceData.ask, currencyPair.ratePrecision, currencyPair.pipsPosition)
  const spread = getSpread(
    priceData.bid,
    priceData.ask,
    currencyPair.pipsPosition,
    currencyPair.ratePrecision,
  )
  const isDisabled = rfqState !== 'received' && disabled
  const isExpired = rfqState === 'expired'
  const isRfqStateCanRequest = rfqState === 'canRequest'
  const isRfqStateRequested = rfqState === 'requested'
  const isRfqStateNone = rfqState === 'none'
  const isRfqStateReceived = rfqState === 'received'

  return (
    <PriceControlsStyle>
      {(isRfqStateNone || isRfqStateReceived || isExpired) && (
        <PriceButton
          handleClick={() => executeTrade(Direction.Sell, priceData.bid)}
          direction={Direction.Sell}
          big={bidRate.bigFigure}
          pip={bidRate.pips}
          tenth={bidRate.pipFraction}
          rawRate={bidRate.rawRate}
          priceAnnounced={isRfqStateReceived}
          disabled={isDisabled}
          expired={isExpired}
        />
      )}
      {isRfqStateCanRequest && (
        <PriceButtonDisabledPlaceholder>
          <Icon className="fas fa-ban fa-flip-horizontal" />
          Streaming price unavailable
        </PriceButtonDisabledPlaceholder>
      )}
      {isRfqStateRequested && (
        <PriceButtonDisabledPlaceholder>
          <AdaptiveLoaderWrapper>
            <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
          </AdaptiveLoaderWrapper>
          Awaiting price
        </PriceButtonDisabledPlaceholder>
      )}
      <PriceMovement
        priceMovementType={priceData.priceMovementType}
        spread={spread.formattedValue}
      />
      {(isRfqStateNone || isRfqStateReceived || isExpired) && (
        <PriceButton
          handleClick={() => executeTrade(Direction.Buy, priceData.ask)}
          direction={Direction.Buy}
          big={askRate.bigFigure}
          pip={askRate.pips}
          tenth={askRate.pipFraction}
          rawRate={askRate.rawRate}
          priceAnnounced={isRfqStateReceived}
          disabled={isDisabled}
          expired={isExpired}
        />
      )}
      {isRfqStateCanRequest && (
        <PriceButtonDisabledPlaceholder>
          <Icon className="fas fa-ban fa-flip-horizontal" />
          Streaming price unavailable
        </PriceButtonDisabledPlaceholder>
      )}
      {isRfqStateRequested && (
        <PriceButtonDisabledPlaceholder>
          <AdaptiveLoaderWrapper>
            <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
          </AdaptiveLoaderWrapper>
          Awaiting price
        </PriceButtonDisabledPlaceholder>
      )}
    </PriceControlsStyle>
  )
}

export default PriceControls
