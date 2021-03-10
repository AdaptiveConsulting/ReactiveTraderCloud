import { Loader } from "@/components/Loader"
import { lazy, Suspense } from "react"
import { trades$ } from "@/services/trades"
import styled from "styled-components"
const TradesCore = lazy(() => import("./TradesCore"))

const TradesWrapper = styled.article`
  height: 100%;
  padding: 0.5rem 1rem;
  user-select: none;
`

trades$.subscribe()
export const Trades: React.FC = () => (
  <TradesWrapper>
    <Suspense fallback={<Loader />}>
      <TradesCore />
    </Suspense>
  </TradesWrapper>
)
