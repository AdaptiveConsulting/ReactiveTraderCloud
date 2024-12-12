import { memo, PropsWithChildren } from "react"

import { FlexBox } from "@/client/components/FlexBox"
import { Typography } from "@/client/components/library/Typography"
import { Direction, RfqState } from "@/generated/TradingGateway"
import { useCreditInstrumentById } from "@/services/credit"

import {
  CusipWithBenchmark,
  DirectionLabel,
  InstrumentLabelContainer,
  isBuy,
  isRfqTerminated,
} from "../../common"

interface CardHeaderProps {
  direction: Direction
  instrumentId: number
  rfqState: RfqState
}

const DirectionTypography = ({ children }: PropsWithChildren) => (
  <Typography variant="Text xs/Medium" allowLineHeight>
    {children}
  </Typography>
)

export const CardHeader = memo(function CardHeader({
  direction,
  instrumentId,
  rfqState,
}: CardHeaderProps) {
  const instrument = useCreditInstrumentById(instrumentId)
  const terminated = isRfqTerminated(rfqState)
  const accepted = rfqState === RfqState.Closed

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
        <Typography variant="Text xs/Medium" allowLineHeight>
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
