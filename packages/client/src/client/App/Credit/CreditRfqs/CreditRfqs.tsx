import { lazy, Suspense } from "react"
import styled from "styled-components"

import { Loader } from "@/client/components/Loader"

const CreditRfqsCore = lazy(() => import("./CreditRfqsCore"))

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
const loader = (
  <Loader
    ariaLabel="Loading Credit RFQ tiles"
    minWidth="22rem"
    minHeight="22rem"
  />
)

export const CreditRfqs = () => (
  <CreditRfqsWrapper>
    <Suspense fallback={loader}>
      <CreditRfqsCore>{loader}</CreditRfqsCore>
    </Suspense>
  </CreditRfqsWrapper>
)

export default CreditRfqs
