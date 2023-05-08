import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { getTornOutSections } from "@/App/TearOutSection/state"
import { FxTrades } from "@/App/Trades"
import Resizer from "@/components/Resizer"

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
