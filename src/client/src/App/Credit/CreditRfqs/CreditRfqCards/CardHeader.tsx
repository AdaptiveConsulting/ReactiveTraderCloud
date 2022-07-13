import { Direction } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"
import { memo } from "react"
import {
  DirectionContainer,
  DirectionLabel,
  InstrumentCusip,
  InstrumentLabelContainer,
  InstrumentName,
} from "./styled"

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
          <DirectionLabel direction={direction}>BUY</DirectionLabel>
        )}
        <InstrumentLabelContainer direction={direction}>
          <InstrumentName>{instrument?.name ?? "No name found"}</InstrumentName>
          <InstrumentCusip>
            {instrument?.cusip ?? "No cusip found"}
          </InstrumentCusip>
        </InstrumentLabelContainer>
        {direction === Direction.Sell && (
          <DirectionLabel direction={direction}>SELL</DirectionLabel>
        )}
      </DirectionContainer>
    )
  },
)
