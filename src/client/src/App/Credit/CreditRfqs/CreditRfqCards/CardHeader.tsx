import { Direction } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"
import { memo } from "react"
import {
  DirectionContainer,
  DirectionLabel,
  InstrumentLabelContainer,
  InstrumentName,
} from "../../common"
import { CusipWithBenchmark } from "../../common/CusipWithBenchmark"

interface CardHeaderProps {
  direction: Direction
  instrumentId: number
}

export const CardHeader = memo(
  ({ direction, instrumentId }: CardHeaderProps) => {
    const instrument = useCreditInstrumentById(instrumentId)

    return (
      <DirectionContainer direction={direction}>
        {direction === Direction.Buy && (
          <DirectionLabel direction={direction}>YOU BUY</DirectionLabel>
        )}
        <InstrumentLabelContainer direction={direction}>
          <InstrumentName>{instrument?.name ?? "No name found"}</InstrumentName>
          <CusipWithBenchmark
            cusip={instrument?.cusip}
            benchmark={instrument?.benchmark}
          />
        </InstrumentLabelContainer>
        {direction === Direction.Sell && (
          <DirectionLabel direction={direction}>YOU SELL</DirectionLabel>
        )}
      </DirectionContainer>
    )
  },
)
