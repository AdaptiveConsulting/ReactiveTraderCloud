import { ErrorIcon } from "@/client/components/icons"
import ErrorIconSvg from "@/client/components/icons/svg/errorIcon.svg"
import { Typography } from "@/client/components/Typography"
import { ExecutionStatus } from "@/services/executions"

import { NoTradeState, TileStates, TradeState } from "../../Tile.state"
import { OverlayBackgroundImage, OverlayBase } from "./components"
import { OverlayProps } from "./OverlayProps"

export const FailureOverlay = ({
  tileState,
  ...props
}: OverlayProps & { tileState: TradeState | NoTradeState }) => (
  <OverlayBase
    backgroundColor="Colors/Background/bg-error-primary"
    color="Colors/Foreground/fg-error-primary"
    Icon={<ErrorIcon />}
    tradeId={tileState.trade?.tradeId}
    {...props}
  >
    <OverlayBackgroundImage
      justifyContent="center"
      alignItems="center"
      url={ErrorIconSvg}
    >
      <Typography
        variant="Text md/Bold"
        color="Colors/Text/text-primary (900)"
        role="alert"
      >
        {(() => {
          if (tileState.status === TileStates.Timeout) {
            return "Trade execution timeout exceeded"
          }

          if (tileState.status === TileStates.CreditExceeded) {
            return "Credit limit exceeded"
          }

          if (
            tileState.status === TileStates.Finished &&
            tileState.trade.status === ExecutionStatus.Rejected
          ) {
            return "Your trade has been rejected"
          }
        })()}
      </Typography>
    </OverlayBackgroundImage>
  </OverlayBase>
)
