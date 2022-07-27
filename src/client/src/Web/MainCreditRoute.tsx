import { CreditRfqForm, CreditRfqs } from "@/App/Credit"
import { getTornOutSections } from "@/App/TearOutSection/state"
import { Trades } from "@/App/Trades"
import { DraggableSectionTearOut } from "@/components/DraggableTearOut"
import Resizer from "@/components/Resizer"
import MainLayout from "./MainLayout"
import { TradeRoute } from "@/services/trades/types"

const CREDIT_TEAR_OUT_SECTIONS = ["newRfq", "creditBlotter"] as const
const useTornOutSections = getTornOutSections(CREDIT_TEAR_OUT_SECTIONS)

const MainCreditRoute: React.FC = () => {
  const tornOutSections = useTornOutSections()
  return (
    <MainLayout>
      <Resizer defaultHeight={30}>
        <CreditRfqs />
        <Trades route={TradeRoute.Credit} />
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
