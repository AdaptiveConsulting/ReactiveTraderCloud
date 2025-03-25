import { format } from "date-fns"
import styled from "styled-components"

import { CheckCircleIcon } from "@/client/components/icons"
import { Stack, StackProps } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"
import { formatNumber } from "@/client/utils"
import { Direction } from "@/generated/TradingGateway"
import { ExecutionTrade } from "@/services/executions"

import { useTileContext } from "../../Tile.context"
import { OverlayBase } from "./components"
import { OverlayProps } from "./OverlayProps"

const StatBackground = styled(Stack)`
  border: 1px solid
    ${({ theme }) => theme.color["Colors/Border/border-secondary"]};
`

const Stat = ({
  name,
  value,
  ...props
}: { name: string; value: string | number } & StackProps) => {
  const { showingChart } = useTileContext()
  return (
    <StatBackground
      direction={showingChart ? "column" : "row"}
      backgroundColor="Colors/Background/bg-secondary"
      paddingX="md"
      paddingY="xs"
      gap={showingChart ? "xs" : "sm"}
      {...props}
    >
      <Typography
        variant="Text sm/Regular"
        color="Colors/Text/text-tertiary (600)"
      >
        {name}
      </Typography>
      <Typography
        variant="Text sm/Regular"
        color="Colors/Text/text-primary (900)"
      >
        {value}
      </Typography>
    </StatBackground>
  )
}

export const SuccessOverlay = ({
  trade,
  base,
  terms,
  onClose,
}: OverlayProps & { trade: ExecutionTrade }) => {
  const { direction, notional, spotRate, valueDate, tradeId } = trade

  return (
    <OverlayBase
      backgroundColor="Colors/Background/bg-primary"
      base={base}
      terms={terms}
      tradeId={tradeId}
      onClose={onClose}
      Icon={<CheckCircleIcon />}
      color="Colors/Foreground/fg-success-primary"
    >
      <Stack width="100%" padding="xs" wrap="wrap" gap="xs" role="alert">
        <Stack
          width="100%"
          backgroundColor="Colors/Background/bg-success-primary"
          paddingY="sm"
          justifyContent="center"
          gap="sm"
        >
          <Typography
            variant="Text md/Semibold"
            color="Colors/Text/text-primary (900)"
          >
            {`You ${direction === Direction.Buy ? "Bought" : "Sold"}`}
          </Typography>
          <Typography
            variant="Text md/Semibold"
            color="Colors/Text/text-primary (900)"
          >
            {`${base} ${formatNumber(notional)}`}
          </Typography>
        </Stack>
        <Stat
          name="Cost"
          value={`${terms} ${formatNumber(notional * spotRate)}`}
          flex="1"
        />
        <Stat name="Rate" value={spotRate} flex="1" />
        <Stat
          name="Settlement"
          value={`(Spt) ${format(valueDate, "dd MMM")}`}
          flexBasis="100%"
        />
      </Stack>
    </OverlayBase>
  )
}
