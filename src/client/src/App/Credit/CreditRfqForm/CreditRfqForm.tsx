import styled from "styled-components"
import { CreditRfqFormCore } from "./CreditRfqFormCore"

const CreditRfqFormWrapper = styled.div`
  height: 100%;
  flex: 0 0 371px;
  overflow: auto;
  padding: 0.5rem 1rem 0.5rem 0;
  user-select: none;
`

export const CreditRfqForm = () => (
  <CreditRfqFormWrapper>
    <CreditRfqFormCore />
  </CreditRfqFormWrapper>
)
