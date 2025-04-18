import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { useTheme } from "styled-components"

import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"
import { formatAsWholeNumber } from "@/client/utils/formatNumber"
import { history$ } from "@/services/analytics"

const [useLastPosition, lastPosition$] = bind(
  history$.pipe(map((history) => history[history.length - 1]?.usPnl ?? 0)),
)

export const LastPosition = () => {
  const lastPos = useLastPosition()
  const lastPosStr = `${lastPos >= 0 ? "+" : ""}${formatAsWholeNumber(lastPos)}`

  const theme = useTheme()

  return (
    <Typography variant="Text md/Regular">
      <Stack alignItems="center">
        USD
        <Typography
          style={{
            paddingLeft: theme.spacing.sm,
            paddingRight: theme.spacing.sm,
          }}
          color={
            lastPos >= 0
              ? "Colors/Border/border-buy"
              : "Colors/Border/border-sell"
          }
          data-testid="lastPosition"
        >
          {lastPosStr}
        </Typography>
      </Stack>
    </Typography>
  )
}

export { lastPosition$ }
