import { CreditRfqForm, CreditRfqs } from "@/App/Credit"
import { getTornOutSections } from "@/App/TearOutSection/state"
import { CreditTrades } from "@/App/Trades"
import Resizer from "@/components/Resizer"
import {
  registerCreditNotifications,
  unregisterCreditNotifications,
} from "@/notifications"
import { useEffect } from "react"
import MainLayout from "./MainLayout"

const CREDIT_TEAR_OUT_SECTIONS = ["newRfq", "creditBlotter"] as const
const useTornOutSections = getTornOutSections(CREDIT_TEAR_OUT_SECTIONS)

const MainCreditRoute: React.FC = () => {
  const tornOutSections = useTornOutSections()

  useEffect(() => {
    registerCreditNotifications()

    return unregisterCreditNotifications
  }, [])

  return (
    <MainLayout>
      <Resizer defaultHeight={30}>
        <CreditRfqs />
        {!tornOutSections.creditBlotter && <CreditTrades />}
      </Resizer>
      {!tornOutSections.newRfq && <CreditRfqForm />}
    </MainLayout>
  )
}
export default MainCreditRoute
