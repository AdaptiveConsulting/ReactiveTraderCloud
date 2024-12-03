import { lazy } from "react"
import styled from "styled-components"

import { RegionWrapper } from "@/client/components/layout/Region"
import { Loader } from "@/client/components/Loader"

const CreditRfqsCore = lazy(() => import("./CreditRfqsCore"))

const CreditRfqsWrapper = styled(RegionWrapper)`
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
  <CreditRfqsWrapper fallback={loader}>
    <CreditRfqsCore>{loader}</CreditRfqsCore>
  </CreditRfqsWrapper>
)

export default CreditRfqs
