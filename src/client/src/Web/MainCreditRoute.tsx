import { CreditRfqForm, CreditRfqs } from "@/App/Credit"
import { getTornOutSections } from "@/App/TearOutSection/state"
import { DraggableSectionTearOut } from "@/components/DraggableTearOut"
import Resizer from "@/components/Resizer"
import styled from "styled-components"
import MainLayout from "./MainLayout"
import { Trades } from "@/App/Trades"

const Placeholder = styled.div`
  margin: 3em;
`
const CREDIT_TEAR_OUT_SECTIONS = ["newRfq"] as const
const useTornOutSections = getTornOutSections(CREDIT_TEAR_OUT_SECTIONS)

const MainCreditRoute: React.FC = () => {
  const tornOutSections = useTornOutSections()
  return (
    <MainLayout>
      <Resizer defaultHeight={30}>
        <CreditRfqs />
        <Trades credit={true} />
      </Resizer>
      {!tornOutSections.newRfq && (
        <DraggableSectionTearOut section="newRfq">
          <CreditRfqForm />
        </DraggableSectionTearOut>
      )}
    </MainLayout>
  )
}
export default MainCreditRoute
