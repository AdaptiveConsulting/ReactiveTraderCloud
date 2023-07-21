import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { combineLatest, merge } from "rxjs"
import { delay, map, mergeMap, tap } from "rxjs/operators"

import { HIGHLIGHT_ROW_FLASH_TIME } from "@/client/constants"
import { RfqState } from "@/generated/TradingGateway"
import { clearedRfqIds$, creditRfqsById$ } from "@/client/services/credit"

import { timeRemainingComparator } from "../../common"
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

/**
 * Signal to capture a tradeId of a credit RFQ card to highlight
 */
export const [creditRfqCardHighlight$, setCreditRfqCardHighlight] =
  createSignal<number>()

/**
 * State hook that emits tradeId of row to highlight for x seconds
 * highlighted row will be either from manually updating tradeRowHighlight$ or a new trade
 */

export const [useCreditRfqCardHighlight] = bind(
  merge([
    creditRfqCardHighlight$,
    creditRfqCardHighlight$.pipe(
      delay(HIGHLIGHT_ROW_FLASH_TIME),
      map(() => undefined),
    ),
  ]).pipe(mergeMap((tradeId) => tradeId)),
  null,
)

export const CreditRfqCards = () => {
  const rfqIds = useFilteredCreditRfqIds()
  const highlightedRfqCard = useCreditRfqCardHighlight()

  return (
    <CreditRfqCardsWrapper empty={rfqIds.length === 0}>
      {rfqIds.length > 0 ? (
        rfqIds.map((id) => (
          <Card id={id} key={id} highlight={highlightedRfqCard === id} />
        ))
      ) : (
        <NoRfqsScreen />
      )}
    </CreditRfqCardsWrapper>
  )
}
