import { lazy } from "react"

import { RegionWrapper } from "@/client/components/layout/Region"
import { Loader } from "@/client/components/Loader"

const TradesCore = lazy(() => import("./CoreFxTrades"))

export const FxTrades = () => (
  <RegionWrapper fallback={<Loader />}>
    <TradesCore />
  </RegionWrapper>
)

export default FxTrades
