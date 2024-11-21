import styled from "styled-components"

import { clear, sendRfq, useIsValid } from "../state"

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
  background-color: ${({ theme }) => theme.core.darkBackground};
`

const SendRfqButton = styled(ActionButton)<{ disabled?: boolean }>`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) =>
    theme.colors.spectrum.uniqueCollections.Buy.base};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

export const RfqButtonPanel = () => {
  const valid = useIsValid()

  return (
    <RfqButtonPanelWrapper>
      <ClearButton onClick={() => clear()}>Clear</ClearButton>
      <SendRfqButton onClick={sendRfq} disabled={!valid}>
        Send RFQ
      </SendRfqButton>
    </RfqButtonPanelWrapper>
  )
}
