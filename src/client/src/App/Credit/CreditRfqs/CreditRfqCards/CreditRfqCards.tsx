import { RfqState } from "@/generated/TradingGateway"
import { clearedRfqIds$, creditRfqsById$ } from "@/services/credit"
import { timeRemainingComparator } from "@/utils"
import { bind } from "@react-rxjs/core"
import { combineLatest } from "rxjs"
import { map } from "rxjs/operators"
import { RfqsTab, selectedRfqsTab$ } from "../selectedRfqsTab"
import { Card } from "./CreditRfqCard"
import { NoRfqsScreen } from "./NoRfqsScreen/NoRfqsScreen"
import { CreditRfqCardsWrapper } from "./styled"

const RFQ_STATE_TO_TAB_MAPPING: Record<RfqState, RfqsTab> = {
  [RfqState.Open]: RfqsTab.Live,
  [RfqState.Expired]: RfqsTab.Expired,
  [RfqState.Cancelled]: RfqsTab.Cancelled,
  [RfqState.Closed]: RfqsTab.Done,
}

function shouldRfqBeInTab(rfqState: RfqState, selectedTab: RfqsTab): boolean {
  return (
    selectedTab === RfqsTab.All ||
    RFQ_STATE_TO_TAB_MAPPING[rfqState] === selectedTab
  )
}

const [useFilteredCreditRfqIds] = bind(
  combineLatest([creditRfqsById$, selectedRfqsTab$, clearedRfqIds$]).pipe(
    map(([creditRfqsById, selectedRfqsTab, clearedRfqIds]) => {
      const sortedRfqs = [...Object.values(creditRfqsById)].sort(
        timeRemainingComparator,
      )

      return sortedRfqs
        .filter((rfqDetails) =>
          shouldRfqBeInTab(rfqDetails.state, selectedRfqsTab),
        )
        .filter((rfqDetail) => !clearedRfqIds.includes(rfqDetail.id))
        .map(({ id }) => id)
    }),
  ),
)

export const CreditRfqCards = () => {
  const rfqIds = useFilteredCreditRfqIds()

  return (
    <CreditRfqCardsWrapper empty={rfqIds.length === 0}>
      {rfqIds.length > 0 ? (
        rfqIds.map((id) => <Card id={id} key={id} />)
      ) : (
        <NoRfqsScreen />
      )}
    </CreditRfqCardsWrapper>
  )
}
