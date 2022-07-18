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
}

export const CreditSellSideHeader = memo(
  ({ direction, instrumentId }: CreditSellSideHeaderProps) => {
    const instrument = useCreditInstrumentById(instrumentId)

    return (
      <DirectionContainer direction={direction}>
        {direction === Direction.Buy && (
          <DirectionLabel direction={direction}> YOU BUY</DirectionLabel>
        )}
        <InstrumentLabelContainer direction={direction}>
          <InstrumentName>{instrument?.name ?? "No name found"}</InstrumentName>
          <CusipWithBenchmark cusip={instrument?.cusip} />
        </InstrumentLabelContainer>
        {direction === Direction.Sell && (
          <DirectionLabel direction={direction}> YOU SELL</DirectionLabel>
        )}
      </DirectionContainer>
    )
  },
)
