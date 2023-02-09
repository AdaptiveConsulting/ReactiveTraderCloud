import { Direction, RfqState } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"
import { memo } from "react"
import { CusipWithBenchmark } from "@/components/CusipWithBenchmark"
import {
  DirectionContainer,
  DirectionLabel,
  InstrumentLabelContainer,
  InstrumentName,
} from "@/components/RfqTicketHeader"
import { isRfqTerminated } from "@/utils"

interface CardHeaderProps {
  direction: Direction
  instrumentId: number
  rfqState: RfqState
}

export const CardHeader = memo(function CardHeader({
  direction,
  instrumentId,
  rfqState,
}: CardHeaderProps) {
  const instrument = useCreditInstrumentById(instrumentId)
  const terminated = isRfqTerminated(rfqState)
  const accepted = rfqState === RfqState.Closed

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
})
