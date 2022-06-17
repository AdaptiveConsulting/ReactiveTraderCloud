import { ACK_CREATE_RFQ_RESPONSE } from "@/generated/TradingGateway"
import { createCreditRfq } from "@/services/creditRfqRequests"
import { Direction } from "@/services/trades"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import { of, concat } from "rxjs"
import { exhaustMap, filter, map, tap, withLatestFrom } from "rxjs/operators"
import styled from "styled-components"
import {
  selectedCounterpartyIds$,
  setSelectedCounterpartyIds,
  useSelectedCounterpartyIds,
} from "./CounterpartySelection"
import {
  selectedInstrumentId$,
  setCusip,
  setSelectedInstrumentId,
  useSelectedInstrument,
} from "./CreditInstrumentSearch"
import { direction$, setDirection } from "./DirectionToggle"
import { quantity$, setQuantity, useQuantity } from "./RfqParameters"

const RfqButtonPanelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const ActionButton = styled.button`
  border-radius: 3px;
  user-select: none;
  padding: 0 0.7rem;
  height: 24px;
  font-size: 11px;
  font-weight: 500;
`

const ClearButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.primary.base};
`

const SendRfqButton = styled(ActionButton)<{ disabled?: boolean }>`
  background-color: ${({ theme }) =>
    theme.colors.spectrum.uniqueCollections.Buy.base};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

const [rfqRequest$, sendRfq] = createSignal()
export const [, rfqResponse$] = bind(
  rfqRequest$.pipe(
    withLatestFrom(
      direction$,
      selectedInstrumentId$,
      quantity$,
      selectedCounterpartyIds$,
    ),
    filter(
      ([_, _direction, instrumentId, quantity, dealerIds]) =>
        instrumentId !== null && quantity.value > 0 && dealerIds.length > 0,
    ),
    map(([_, direction, instrumentId, quantity, dealerIds]) => ({
      instrumentId: instrumentId!,
      dealerIds,
      quantity: quantity.value * 1000,
      direction,
      expirySecs: 10,
    })),
    exhaustMap((request) =>
      // clear RFQ response immediately after emission
      concat(
        createCreditRfq(request).pipe(
          map((response) => ({ ...response, request })),
        ),
        of(null),
      ),
    ),
    tap((response) => {
      if (response?.type === ACK_CREATE_RFQ_RESPONSE) {
        setDirection(Direction.Buy)
        setSelectedInstrumentId(null)
        setQuantity("")
        setSelectedCounterpartyIds([])
      }
    }),
  ),
  null,
)

rfqResponse$.subscribe()

export const RfqButtonPanel: FC = () => {
  const selectedInstrument = useSelectedInstrument()
  const quantity = useQuantity()
  const selectedCounterpartyIds = useSelectedCounterpartyIds()

  const detailsMissing =
    selectedInstrument === null ||
    quantity.value === 0 ||
    selectedCounterpartyIds.length === 0

  const clearRfqTicket = () => {
    setDirection(Direction.Buy)
    setCusip("")
    setSelectedInstrumentId(null)
    setQuantity("")
    setSelectedCounterpartyIds([])
  }

  return (
    <RfqButtonPanelWrapper>
      <ClearButton onClick={clearRfqTicket}>Clear</ClearButton>
      <SendRfqButton onClick={sendRfq} disabled={detailsMissing}>
        Send RFQ
      </SendRfqButton>
    </RfqButtonPanelWrapper>
  )
}
