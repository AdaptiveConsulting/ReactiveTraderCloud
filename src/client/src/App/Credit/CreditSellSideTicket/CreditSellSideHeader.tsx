import { Direction } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"
import { memo } from "react"
import { CusipWithBenchmark } from "../common/CusipWithBenchmark"
import {
  DirectionContainer,
  DirectionLabel,
  InstrumentLabelContainer,
  InstrumentName,
} from "../common/RfqTicketHeader"

interface CreditSellSideHeaderProps {
  direction: Direction
  instrumentId: number
  terminated: boolean
}

export const CreditSellSideHeader = memo(
  ({ direction, instrumentId, terminated }: CreditSellSideHeaderProps) => {
    const instrument = useCreditInstrumentById(instrumentId)

    return (
      <DirectionContainer direction={direction} terminated={terminated}>
        {direction === Direction.Buy && (
          <DirectionLabel direction={direction} terminated={terminated}>
            YOU BUY
          </DirectionLabel>
        )}
        <InstrumentLabelContainer direction={direction} terminated={terminated}>
          <InstrumentName>{instrument?.name ?? "No name found"}</InstrumentName>
          <CusipWithBenchmark cusip={instrument?.cusip} />
        </InstrumentLabelContainer>
        {direction === Direction.Sell && (
          <DirectionLabel direction={direction} terminated={terminated}>
            YOU SELL
          </DirectionLabel>
        )}
      </DirectionContainer>
    )
  },
)
