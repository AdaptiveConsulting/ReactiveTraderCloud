import { FC } from "react"
import { DateTime, Info } from "luxon"
import { usePlatform } from "@/platform"
import PriceControls from "../../horizontalTiles/hover/HoveredPriceControls"
import NotionalInput from "../../horizontalTiles/BaseNotionalInput"
import AnalyticsTileChart from "../BaseAnalyticsTileChart"

import {
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
  AnalyticsTileWrapper,
  PriceControlWrapper,
} from "../styled"
import RfqTimer from "@/widgets/spotTile/components/RfqTimer"

import { memoDateFormatter } from "@/widgets/spotTile/model/dateUtils"
import { getDefaultNotionalValue } from "@/widgets/spotTile/components/Tile/TileBusinessLogic"
import { SpotTileProps } from "@/widgets/spotTile/components/types"
import { getConstsFromRfqState } from "@/widgets/spotTile/model/spotTileUtils"
import TileHeader from "@/widgets/spotTile/components/TileHeader"
import { SpotTileStyle } from "../../horizontalTiles/BaseSpotTile"
import styled from "styled-components"

export const AnalyticsTileStyle = styled(SpotTileStyle)`
  background-color: ${({ theme }) => theme.primary[1]};
`
//@ts-ignore
const localZoneName = Info.features().zones ? DateTime.local().zoneName : "utc"
const dateFomatter = memoDateFormatter((valueDate) => valueDate.slice(0, 10))
const AnalyticsWrapperWithPlatform: FC<{ shouldMoveDate: boolean }> = (
  props,
) => {
  const platform = usePlatform()
  //@ts-ignore
  return <AnalyticsTileWrapper {...props} platform={platform} />
}
//@ts-ignore
class AnalyticsTile extends React.PureComponent<SpotTileProps> {
  private handleRfqRejected = () =>
    this.props.rfq.reject({ currencyPair: this.props.currencyPair })

  render() {
    const {
      currencyPair,
      spotTileData: {
        isTradeExecutionInFlight,
        price,
        historicPrices,
        rfqPrice,
        rfqState,
        rfqTimeout,
        rfqReceivedTime,
        lastTradeExecutionStatus,
        notional: spotTileNotional,
      },
      updateNotional,
      resetNotional,
      executeTrade,
      children,
      tradingDisabled,
      inputDisabled,
      inputValidationMessage,
      displayCurrencyChart,
      rfq,
    } = this.props
    const defaultNotional = getDefaultNotionalValue(currencyPair)
    const notional =
      spotTileNotional !== undefined
        ? spotTileNotional
        : getDefaultNotionalValue(currencyPair)

    const spotDate = dateFomatter(price.valueDate, false, localZoneName)
    const date = spotDate && `SPT (${spotDate})`

    const {
      isRfqStateExpired,
      isRfqStateCanRequest,
      isRfqStateNone,
      isRfqStateReceived,
    } = getConstsFromRfqState(rfqState)

    const showResetButton =
      !isTradeExecutionInFlight &&
      defaultNotional !== notional &&
      (isRfqStateNone || isRfqStateCanRequest || isRfqStateExpired)

    const showTimer = isRfqStateReceived && rfqTimeout
    const isTimerOn =
      Boolean(showTimer) && rfqTimeout !== null && rfqReceivedTime !== null
    const priceData =
      (isRfqStateReceived || isRfqStateExpired) && rfqPrice ? rfqPrice : price

    return (
      <AnalyticsWrapperWithPlatform shouldMoveDate={false}>
        <AnalyticsTileStyle
          className="spot-tile"
          data-qa="analytics-tile__spot-tile"
          data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
        >
          <TileHeader
            ccyPair={currencyPair}
            date={date}
            displayCurrencyChart={displayCurrencyChart}
          />
          <AnalyticsTileContent>
            <GraphNotionalWrapper isTimerOn={isTimerOn}>
              <LineChartWrapper isTimerOn={isTimerOn}>
                <AnalyticsTileChart history={historicPrices} />
              </LineChartWrapper>
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
              {showTimer && rfqTimeout !== null && rfqReceivedTime !== null && (
                <RfqTimer
                  onRejected={this.handleRfqRejected}
                  receivedTime={rfqReceivedTime}
                  timeout={rfqTimeout}
                  isAnalyticsView
                />
              )}
            </GraphNotionalWrapper>
            <PriceControlWrapper>
              <PriceControls
                isTradeExecutionInFlight={isTradeExecutionInFlight}
                executeTrade={executeTrade}
                priceData={priceData}
                currencyPair={currencyPair}
                disabled={tradingDisabled}
                rfqState={rfqState}
                isAnalyticsView={true}
                rfq={rfq}
                notional={notional}
                lastTradeExecutionStatus={lastTradeExecutionStatus}
              />
            </PriceControlWrapper>
          </AnalyticsTileContent>
        </AnalyticsTileStyle>
        {children}
      </AnalyticsWrapperWithPlatform>
    )
  }
}

export default AnalyticsTile
