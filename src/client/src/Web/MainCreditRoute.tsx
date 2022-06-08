import { CreditRfqForm } from "@/App/CreditRfqForm"
import { CreditRfqs } from "@/App/CreditRfqs"
import { handleTearOutSection } from "@/App/TearOutSection/handleTearOutSection"
import {
  TornOutSection,
  useTearOutSectionEntry,
} from "@/App/TearOutSection/state"
import { DraggableSectionTearOut } from "@/components/DraggableTearOut"
import Resizer from "@/components/Resizer"
import { useEffect, useState } from "react"
import styled from "styled-components"
import MainLayout from "./MainLayout"

const Placeholder = styled.div`
  margin: 3em;
`

const MainCreditRoute: React.FC = () => {
  const tearOutEntry = useTearOutSectionEntry()
  const [tornOutSectionState, setTornOutSectionState] =
    useState<TornOutSection>({
      tiles: false,
      blotter: false,
      analytics: false,
      newRfq: false,
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
        <CreditRfqs />
        <Placeholder>Credit Blotter Placeholder</Placeholder>
      </Resizer>
      {!tornOutSectionState.newRfq && (
        <DraggableSectionTearOut section="newRfq">
          <CreditRfqForm />
        </DraggableSectionTearOut>
      )}
    </MainLayout>
  )
}
export default MainCreditRoute
