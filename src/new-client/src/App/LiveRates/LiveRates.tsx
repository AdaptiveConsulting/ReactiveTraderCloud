import { Loader } from "@/components/Loader"
import { lazy, Suspense } from "react"
import { merge } from "rxjs"
import {
  currencyPairDependant$,
  currencyPairs$,
} from "@/services/currencyPairs"
import { getHistoricalPrices$, getPrice$ } from "@/services/prices"
import styled from "styled-components"
const LiveRatesCore = lazy(() => import("./LiveRatesCore"))

currencyPairs$.subscribe()
currencyPairDependant$((symbol: string) =>
  merge(getHistoricalPrices$(symbol), getPrice$(symbol)),
).subscribe()

const LiveRateWrapper = styled.div`
  padding: 0.5rem 0 0.5rem 1rem;
  user-select: none;
  height: 100%;

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: auto;
`

const OverflowScroll = styled.div`
  overflow-y: scroll;
  height: 100%;
`

const loader = <Loader minWidth="22rem" minHeight="22rem" />
export const LiveRates: React.FC = () => (
  <LiveRateWrapper>
    <OverflowScroll>
      <div data-qa="workspace__tiles-workspace">
        <Suspense fallback={loader}>
          <LiveRatesCore>{loader}</LiveRatesCore>
        </Suspense>
      </div>
    </OverflowScroll>
  </LiveRateWrapper>
)
