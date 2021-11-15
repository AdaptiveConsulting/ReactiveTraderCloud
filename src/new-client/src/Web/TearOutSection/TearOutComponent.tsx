import { HeaderAction } from "@/components/styled"
import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOutSection } from "@/Web/TearOutSection/state"
import { PopInIcon } from "@/components/icons/PopInIcon"
import {
  TornOutTileContext,
  TornOutTradeContext,
  TornOutAnalyticsContext,
} from "@/Web/context"

export const TearOutComponent: React.FC<{ section: string }> = ({
  section,
}) => {
  var context = TornOutTileContext
  if (section === "trades") {
    context = TornOutTradeContext
  } else if (section === "analytics") {
    context = TornOutAnalyticsContext
  }
  return (
    <context.Consumer>
      {(params) => (
        <HeaderAction
          onClick={() =>
            params.isTornOut
              ? window.close()
              : tearOutSection(!params.isTornOut, section)
          }
        >
          {params.isTornOut ? <PopInIcon /> : <PopOutIcon />}
        </HeaderAction>
      )}
    </context.Consumer>
  )
}
