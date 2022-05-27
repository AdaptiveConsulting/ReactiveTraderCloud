import Resizer from "@/components/Resizer"
import { Trades } from "@/App/Trades"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { useEffect, useState } from "react"
import { DraggableSectionTearOut } from "@/components/DraggableTearOut"
import {
  useTearOutSectionEntry,
  TornOutSection,
} from "@/App/TearOutSection/state"
import { handleTearOutSection } from "@/App/TearOutSection/handleTearOutSection"
import MainLayout from "./MainLayout"

export const MainFxRoute: React.FC = () => {
  const tearOutEntry = useTearOutSectionEntry()
  const [tornOutSectionState, setTornOutSectionState] =
    useState<TornOutSection>({
      tiles: false,
      blotter: false,
      analytics: false,
    })

  useEffect(() => {
    if (tearOutEntry) {
      const [tornOut, section] = tearOutEntry
      setTornOutSectionState({ ...tornOutSectionState, [section]: tornOut })
      if (tornOut) {
        handleTearOutSection(section)
      }
    }
  }, [tearOutEntry])

  return (
    <MainLayout>
      <Resizer defaultHeight={30}>
        {!tornOutSectionState.tiles && (
          <DraggableSectionTearOut section="tiles">
            <LiveRates />
          </DraggableSectionTearOut>
        )}
        {!tornOutSectionState.blotter && (
          <DraggableSectionTearOut section="blotter">
            <Trades />
          </DraggableSectionTearOut>
        )}
      </Resizer>
      {!tornOutSectionState.analytics && (
        <DraggableSectionTearOut section="analytics">
          <Analytics />
        </DraggableSectionTearOut>
      )}
    </MainLayout>
  )
}
