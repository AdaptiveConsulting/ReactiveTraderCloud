import { Loader } from "@/components/Loader"
import { lazy, Suspense, useRef } from "react"
import { analytics$ } from "@/services/analytics"
import styled from "styled-components"
import { useHasItBeenVisible } from "@/utils/useHasItBeenVisible"

export const AnalyticsCoreDeferred = import("./AnalyticsCore")
const AnalyticsCore = lazy(() => AnalyticsCoreDeferred)

const AnalyticsWrapper = styled.div<{ hideIfMatches?: string | null }>`
  height: 100%;
  flex: 0 0 371px;
  padding: 0.5rem 1rem 0.5rem 0;
  user-select: none;
  overflow: hidden;
  background: ${({ theme }) => theme.core.darkBackground};

  ${({ hideIfMatches }) =>
    hideIfMatches
      ? `
    @media ${hideIfMatches} {
      display: none;
    }
  `
      : ""}
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

export const Analytics: React.FC<Props> = ({
  hideIfMatches = "(max-width: 750px)",
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const shouldMountAnalytics = useHasItBeenVisible(ref)

  return (
    <AnalyticsWrapper ref={ref} hideIfMatches={hideIfMatches}>
      <Suspense fallback={loader}>
        {shouldMountAnalytics ? (
          <AnalyticsCore>{loader}</AnalyticsCore>
        ) : (
          loader
        )}
      </Suspense>
    </AnalyticsWrapper>
  )
}
