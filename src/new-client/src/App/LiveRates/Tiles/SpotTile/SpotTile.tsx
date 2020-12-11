import React from "react"
import { NotionalInput } from "../Notional"
import { PriceControls } from "../PriceControls/PriceControls"
import { TileHeader } from "../TileHeader"
import {
  NotionalInputWrapper,
  SpotTileWrapper,
  SpotTileStyle,
  ReserveSpaceGrouping,
} from "./styled"
import { useCurrencyPairs } from "services/currencyPairs"
import { usePrice } from "services/tiles"
import { format } from "date-fns"

interface Props {
  id: string
}

export const SpotTile: React.FC<Props> = ({ id }) => {
  //const handleRfqRejected = () => {}
  const currencyPairs = useCurrencyPairs()
  const currencyPair = currencyPairs[id]
  const priceData = usePrice(id)

  const notional = 100000

  const spotDate = priceData.valueDate
    ? format(new Date(priceData.valueDate), "ddMMM")
    : ""
  const date = spotDate && `SPT (${spotDate.toUpperCase()})`

  return (
    <SpotTileWrapper shouldMoveDate={false}>
      <SpotTileStyle
        className="spot-tile"
        data-qa="spot-tile__tile"
        data-qa-id={`currency-pair-${currencyPair.symbol.toLowerCase()}`}
      >
        <ReserveSpaceGrouping>
          <TileHeader ccyPair={currencyPair} date={date} />
          <PriceControls currencyPair={currencyPair} priceData={priceData} />
        </ReserveSpaceGrouping>
        <ReserveSpaceGrouping>
          <NotionalInputWrapper>
            <NotionalInput
              notional={notional}
              currencyPairBase={currencyPair.base}
              currencyPairSymbol={currencyPair.symbol}
            />
          </NotionalInputWrapper>
        </ReserveSpaceGrouping>
      </SpotTileStyle>
    </SpotTileWrapper>
  )
}
