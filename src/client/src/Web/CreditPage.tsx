import { CreditRfqForm, CreditRfqs } from "@/App/Credit"
import { getTornOutSections } from "@/App/TearOutSection/state"
import { CreditTrades } from "@/App/Trades"
import Resizer from "@/components/Resizer"

const CREDIT_TEAR_OUT_SECTIONS = ["newRfq", "creditBlotter"] as const
const useTornOutSections = getTornOutSections(CREDIT_TEAR_OUT_SECTIONS)

const CreditPage = () => {
  const tornOutSections = useTornOutSections()

  return (
    <>
      <Resizer defaultHeight={30}>
        <CreditRfqs />
        {!tornOutSections.creditBlotter && <CreditTrades />}
      </Resizer>
      {!tornOutSections.newRfq && <CreditRfqForm />}
    </>
  )
}
export default CreditPage
