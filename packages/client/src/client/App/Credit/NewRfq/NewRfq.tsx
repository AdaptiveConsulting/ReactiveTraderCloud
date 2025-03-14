import { lazy } from "react"
import styled from "styled-components"

import { RegionWrapper } from "@/client/components/layout/Region"
import { Loader } from "@/client/components/Loader"

const NewRfqCore = lazy(() => import("./NewRfqCore"))

const NewRfqWrapper = styled(RegionWrapper)`
  border-left: ${({ theme }) => theme.color["Colors/Background/bg-primary"]}
    solid ${({ theme }) => theme.spacing.sm};
`

const loader = (
  <Loader ariaLabel="Loading New RFQ Form" minWidth="22rem" minHeight="22rem" />
)

export const NewRfq = () => (
  <NewRfqWrapper fallback={loader}>
    <NewRfqCore>{loader}</NewRfqCore>
  </NewRfqWrapper>
)

export default NewRfq
