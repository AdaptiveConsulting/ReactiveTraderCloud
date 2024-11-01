import { lazy } from "react"

import { Loader } from "@/client/components/Loader"
import { RegionWrapper } from "@/client/components/Region/RegionWrapper"

const TradesCore = lazy(() => import("./CoreFxTrades"))

export const FxTrades = () => (
  <RegionWrapper fallback={<Loader />}>
    <TradesCore />
  </RegionWrapper>
)

export default FxTrades
