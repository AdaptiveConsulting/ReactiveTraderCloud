import React from "react"
import { PriceControls } from "../PriceControls/PriceControls"
import { NotionalInput } from "../Notional"
import { AnalyticsTileChart } from "./AnalyticsTileChart"
import { TileHeader } from "../TileHeader"
import {
  AnalyticsTileStyle,
  AnalyticsTileContent,
  GraphNotionalWrapper,
  LineChartWrapper,
  PriceControlWrapper,
  AnalyticsTileWrapper,
} from "./styled"
import { useCurrencyPairs } from "services/currencyPairs"
import { usePrice, useHistoricalPrices } from "services/tiles"
import { format } from "date-fns"

interface Props {
  id: string
}
//const [useCurrencyPairs] = bind(currencyPairs$)
export const AnalyticsTile: React.FC<Props> = ({ id }) => {
  const currencyPairs = useCurrencyPairs()
  const currencyPair = currencyPairs[id]
  const priceData = usePrice(id)
  const spotDate = priceData.valueDate
    ? format(new Date(priceData.valueDate), "ddMMM")
    : ""
  const date = spotDate && `SPT (${spotDate.toUpperCase()})`
  const isTimerOn = false
  const historicPrices = useHistoricalPrices(id)
  const notional = 100000
  return (
    <AnalyticsTileWrapper shouldMoveDate={false}>
      <AnalyticsTileStyle
        className="spot-tile"
        data-qa="analytics-tile__spot-tile"
        data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
      >
        <TileHeader ccyPair={currencyPair} date={date} />
        <AnalyticsTileContent>
          <GraphNotionalWrapper isTimerOn={isTimerOn}>
            <LineChartWrapper isTimerOn={isTimerOn}>
              <AnalyticsTileChart history={historicPrices} />
            </LineChartWrapper>
            <NotionalInput
              notional={notional}
              currencyPairBase={currencyPair.base}
              currencyPairSymbol={currencyPair.symbol}
            />
          </GraphNotionalWrapper>
          <PriceControlWrapper>
            <PriceControls currencyPair={currencyPair} priceData={priceData} />
          </PriceControlWrapper>
        </AnalyticsTileContent>
      </AnalyticsTileStyle>
    </AnalyticsTileWrapper>
  )
}
