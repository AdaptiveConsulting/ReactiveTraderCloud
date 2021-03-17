import { Loader } from "@/components/Loader"
import { lazy, Suspense, useRef } from "react"
import { analytics$ } from "@/services/analytics"
import styled from "styled-components"
import { useHasItBeenVisible } from "@/utils/useHasItBeenVisible"
const AnalyticsCore = lazy(() => import("./AnalyticsCore"))

const AnalyticsWrapper = styled.div`
  flex: 0 0 371px;
  padding: 0.5rem 1rem 0.5rem 0;
  user-select: none;
  overflow: hidden;

  @media (max-width: 750px) {
    display: none;
  }
`

analytics$.subscribe()

const loader = (
  <Loader
    ariaLabel="Loading price and trade analytics"
    minWidth="22rem"
    minHeight="22rem"
  />
)
export const Analytics: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const shouldMountAnalytics = useHasItBeenVisible(ref)

  return (
    <AnalyticsWrapper ref={ref}>
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
