import { memo, PropsWithChildren } from "react"

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

const DirectionTypography = ({ children }: PropsWithChildren) => (
  <Typography variant="Text sm/Medium" allowLineHeight>
    {children}
  </Typography>
)

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
          <DirectionTypography>
            You {accepted ? "Bought" : "Buy"}
          </DirectionTypography>
        </DirectionLabel>
      )}
      <InstrumentLabelContainer terminated={terminated}>
        <Typography variant="Text sm/Medium" allowLineHeight>
          {instrument?.name ?? "No name found"}
        </Typography>
        <CusipWithBenchmark
          cusip={instrument?.cusip}
          benchmark={instrument?.benchmark}
        />
      </InstrumentLabelContainer>
      {direction === Direction.Sell && (
        <DirectionLabel direction={direction} terminated={terminated}>
          <DirectionTypography>
            You {accepted ? "Sold" : "Sell"}
          </DirectionTypography>
        </DirectionLabel>
      )}
    </FlexBox>
  )
})
