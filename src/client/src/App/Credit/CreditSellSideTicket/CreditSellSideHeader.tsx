import { Direction, QuoteState, RfqState } from "@/generated/TradingGateway"
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
  rfqState: RfqState
  quoteState: QuoteState
}

export const CreditSellSideHeader = memo(
  ({
    direction,
    instrumentId,
    rfqState,
    quoteState,
  }: CreditSellSideHeaderProps) => {
    const instrument = useCreditInstrumentById(instrumentId)
    const accepted = quoteState === QuoteState.Accepted
    const terminated = rfqState !== RfqState.Open && !accepted

    return (
      <DirectionContainer direction={direction} terminated={terminated}>
        {direction === Direction.Buy && (
          <DirectionLabel direction={direction} terminated={terminated}>
            <div>YOU {accepted ? "BOUGHT" : "BUY"}</div>
          </DirectionLabel>
        )}
        <InstrumentLabelContainer direction={direction} terminated={terminated}>
          <InstrumentName>{instrument?.name ?? "No name found"}</InstrumentName>
          <CusipWithBenchmark
            cusip={instrument?.cusip}
            benchmark={instrument?.benchmark}
          />
        </InstrumentLabelContainer>
        {direction === Direction.Sell && (
          <DirectionLabel direction={direction} terminated={terminated}>
            <div>YOU {accepted ? "SOLD" : "SELL"}</div>
          </DirectionLabel>
        )}
      </DirectionContainer>
    )
  },
)
