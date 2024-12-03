import { lazy } from "react"
import styled from "styled-components"

import { RegionWrapper } from "@/client/components/layout/Region"
import { Loader } from "@/client/components/Loader"

const NewRfqCore = lazy(() => import("./NewRfqCore"))

const NewRfqWrapper = styled(RegionWrapper)`
  border-left: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-primary"]}
    solid ${({ theme }) => theme.newTheme.spacing.sm};
  width: ${({ theme }) => theme.newTheme.width["xs"]};
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
