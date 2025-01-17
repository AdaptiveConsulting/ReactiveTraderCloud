import { memo } from "react"

import { FlexBox } from "@/client/components/FlexBox"
import { Typography } from "@/client/components/Typography"
import { Direction } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"

import {
  CusipWithBenchmark,
  DirectionLabel,
  InstrumentLabelContainer,
  isBuy,
} from "../../common"

interface CardHeaderProps {
  direction: Direction
  instrumentId: number
  terminated: boolean
  accepted: boolean
}

export const CardHeader = memo(function CardHeader({
  direction,
  instrumentId,
  terminated,
  accepted,
}: CardHeaderProps) {
  const instrument = useCreditInstrumentById(instrumentId)

  return (
    <FlexBox>
      {isBuy(direction) && (
        <DirectionLabel direction={direction} terminated={terminated}>
          <Typography
            variant="Text sm/Medium"
            color={terminated ? undefined : "Colors/Text/text-white"}
            allowLineHeight
          >
            You {accepted ? "Bought" : "Buy"}
          </Typography>
        </DirectionLabel>
      )}
      <InstrumentLabelContainer terminated={terminated}>
        <Typography variant="Text sm/Medium">
          {instrument?.name ?? "No name found"}
        </Typography>
        <CusipWithBenchmark
          cusip={instrument?.cusip}
          benchmark={instrument?.benchmark}
        />
      </InstrumentLabelContainer>
      {direction === Direction.Sell && (
        <DirectionLabel direction={direction} terminated={terminated}>
          <Typography
            variant="Text sm/Medium"
            color={terminated ? undefined : "Colors/Text/text-white"}
            allowLineHeight
          >
            You {accepted ? "Sold" : "Sell"}
          </Typography>
        </DirectionLabel>
      )}
    </FlexBox>
  )
})
