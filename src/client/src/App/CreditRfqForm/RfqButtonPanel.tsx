import { Direction } from "@/services/trades"
import { FC } from "react"
import styled from "styled-components"
import {
  setSelectedCounterpartyIds,
  useSelectedCounterpartyIds,
} from "./CounterpartySelection"
import {
  setSelectedInstrument,
  useSelectedInstrument,
} from "./CreditInstrumentSearch"
import { setDirection, useDirection } from "./DirectionToggle"
import { setQuantity, useQuantity } from "./RfqParameters"

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

export const RfqButtonPanel: FC = () => {
  const direction = useDirection()
  const selectedInstrument = useSelectedInstrument()
  const quantity = useQuantity()
  const selectedCounterpartyIds = useSelectedCounterpartyIds()

  const detailsMissing =
    selectedInstrument === "" ||
    quantity.value === 0 ||
    selectedCounterpartyIds.length === 0

  const clearRfqTicket = () => {
    setDirection(Direction.Buy)
    setSelectedInstrument("")
    setQuantity("")
    setSelectedCounterpartyIds([])
  }

  const sendRfq = () => {}

  return (
    <RfqButtonPanelWrapper>
      <ClearButton onClick={clearRfqTicket}>Clear</ClearButton>
      <SendRfqButton onClick={sendRfq} disabled={detailsMissing}>
        Send RFQ
      </SendRfqButton>
    </RfqButtonPanelWrapper>
  )
}
