import { FC } from "react"
import styled from "styled-components"

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
  return (
    <RfqButtonPanelWrapper>
      <ClearButton>Clear</ClearButton>
      <SendRfqButton>Send RFQ</SendRfqButton>
    </RfqButtonPanelWrapper>
  )
}
