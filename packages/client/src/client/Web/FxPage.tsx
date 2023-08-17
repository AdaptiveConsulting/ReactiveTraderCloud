import { Analytics } from "client/App/Analytics"
import { LiveRates } from "client/App/LiveRates"
import { getTornOutSections } from "client/App/TearOutSection/state"
import { FxTrades } from "client/App/Trades"
import Resizer from "client/components/Resizer"

const FX_TEAR_OUT_SECTIONS = ["tiles", "blotter", "analytics"] as const
const useTornOutSections = getTornOutSections(FX_TEAR_OUT_SECTIONS)

export const FxPage = () => {
  const tornOutSections = useTornOutSections()
  return (
    <>
      <Resizer defaultHeight={30}>
        {!tornOutSections.tiles && <LiveRates />}
        {!tornOutSections.blotter && <FxTrades />}
      </Resizer>
      {!tornOutSections.analytics && <Analytics />}
    </>
  )
}
