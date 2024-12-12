import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { Typography } from "@/client/components/library/Typography"
import { formatAsWholeNumber } from "@/client/utils/formatNumber"
import { history$ } from "@/services/analytics"

const [useLastPosition, lastPosition$] = bind(
  history$.pipe(map((history) => history[history.length - 1]?.usPnl ?? 0)),
)

const StyledTypography = styled(Typography)`
  padding: 0 ${({ theme }) => theme.newTheme.spacing.sm};
`

export const LastPosition = () => {
  const lastPos = useLastPosition()
  const lastPosStr = `${lastPos >= 0 ? "+" : ""}${formatAsWholeNumber(lastPos)}`

  return (
    <Typography variant="Text md/Regular">
      <FlexBox>
        USD
        <StyledTypography
          color={
            lastPos >= 0
              ? "Colors/Border/border-buy"
              : "Colors/Border/border-sell"
          }
          data-testid="lastPosition"
        >
          {lastPosStr}
        </StyledTypography>
      </FlexBox>
    </Typography>
  )
}

export { lastPosition$ }
