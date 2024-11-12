import { lazy } from "react"

import { RegionWrapper } from "@/client/components/layout/Region"
import { Loader } from "@/client/components/Loader"

const TradesCore = lazy(() => import("./CoreCreditTrades"))

export const CreditTrades = () => (
  <RegionWrapper fallback={<Loader />}>
    <TradesCore />
  </RegionWrapper>
)

export default CreditTrades
