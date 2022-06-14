import { FC } from "react"
import styled from "styled-components"
import { CreditRfqListCore } from "./CreditRfqListCore"

const CreditRfqListWrapper = styled.div`
  padding: 0.5rem 0 0.5rem 1rem;
  user-select: none;
  height: 100%;
  background: ${({ theme }) => theme.core.darkBackground};

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: auto;
`

export const CreditRfqList: FC = () => (
  <CreditRfqListWrapper>
    <CreditRfqListCore />
  </CreditRfqListWrapper>
)
