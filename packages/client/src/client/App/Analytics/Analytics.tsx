import { lazy, useRef } from "react"
import styled from "styled-components"

import { RegionWrapper } from "@/client/components/layout/Region"
import { Loader } from "@/client/components/Loader"
import { useHasItBeenVisible } from "@/client/utils/useHasItBeenVisible"
import { analytics$ } from "@/services/analytics"

const AnalyticsCore = lazy(() => import("./AnalyticsCore"))

const AnalyticsWrapper = styled(RegionWrapper)<{
  hideIfMatches?: string | null
}>`
  border-left: solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-primary"]}
    ${({ theme }) => theme.newTheme.spacing.sm};
  ${({ hideIfMatches }) =>
    hideIfMatches
      ? ` @media ${hideIfMatches} {
       display: none;
       } `
      : ""};
`

analytics$.subscribe()

const loader = (
  <Loader
    ariaLabel="Loading price and trade analytics"
    minWidth="22rem"
    minHeight="22rem"
  />
)

interface Props {
  hideIfMatches?: string | null
}

export const Analytics = ({ hideIfMatches = "(max-width: 750px)" }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const shouldMountAnalytics = useHasItBeenVisible(ref)

  return (
    <AnalyticsWrapper ref={ref} hideIfMatches={hideIfMatches} fallback={loader}>
      {shouldMountAnalytics ? <AnalyticsCore>{loader}</AnalyticsCore> : loader}
    </AnalyticsWrapper>
  )
}

export default Analytics
