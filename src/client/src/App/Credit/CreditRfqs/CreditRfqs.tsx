import styled from "styled-components"
import { CreditRfqsCore } from "./CreditRfqsCore"

const CreditRfqsWrapper = styled.div`
  position: relative;
  padding: 0.5rem 0 0.5rem 1rem;
  user-select: none;
  height: 100%;
  background: ${({ theme }) => theme.core.darkBackground};

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
`

export const CreditRfqs = () => (
  <CreditRfqsWrapper>
    <CreditRfqsCore />
  </CreditRfqsWrapper>
)
