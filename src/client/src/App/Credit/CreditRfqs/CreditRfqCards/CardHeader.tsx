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
  terminated: boolean
}

export const CardHeader = memo(
  ({ direction, instrumentId, terminated }: CardHeaderProps) => {
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
