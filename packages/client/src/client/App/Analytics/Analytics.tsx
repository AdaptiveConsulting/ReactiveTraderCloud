import { lazy, useRef } from "react"
import styled from "styled-components"

import { Loader } from "@/client/components/Loader"
import { RegionWrapper } from "@/client/components/Region/RegionWrapper"
import { useHasItBeenVisible } from "@/client/utils/useHasItBeenVisible"
import { analytics$ } from "@/services/analytics"

const AnalyticsCore = lazy(() => import("./AnalyticsCore"))

const AnalyticsWrapper = styled(RegionWrapper)<{
  hideIfMatches?: string | null
}>`
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
    <AnalyticsWrapper fallback={loader} ref={ref} hideIfMatches={hideIfMatches}>
      {shouldMountAnalytics ? <AnalyticsCore>{loader}</AnalyticsCore> : loader}
    </AnalyticsWrapper>
  )
}

export default Analytics
