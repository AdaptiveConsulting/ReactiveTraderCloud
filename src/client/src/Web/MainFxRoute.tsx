import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { getTornOutSections } from "@/App/TearOutSection/state"
import { Trades } from "@/App/Trades"
import { DraggableSectionTearOut } from "@/components/DraggableTearOut"
import Resizer from "@/components/Resizer"
import MainLayout from "./MainLayout"

const FX_TEAR_OUT_SECTIONS = ["tiles", "blotter", "analytics"] as const
const useTornOutSections = getTornOutSections(FX_TEAR_OUT_SECTIONS)

export const MainFxRoute: React.FC = () => {
  const tornOutSections = useTornOutSections()
  return (
    <MainLayout>
      <Resizer defaultHeight={30}>
        {!tornOutSections.tiles && (
          <DraggableSectionTearOut section="tiles">
            <LiveRates />
          </DraggableSectionTearOut>
        )}
        {!tornOutSections.blotter && (
          <DraggableSectionTearOut section="blotter">
            <Trades />
          </DraggableSectionTearOut>
        )}
      </Resizer>
      {!tornOutSections.analytics && (
        <DraggableSectionTearOut section="analytics">
          <Analytics />
        </DraggableSectionTearOut>
      )}
    </MainLayout>
  )
}
