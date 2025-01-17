import { AnalyticsSectionLayout } from "@/client/components/layout/AnalyticsSectionLayout"
import { Typography } from "@/client/components/Typography"

import { BubbleChart } from "./BubbleChart"
import { data$ } from "./data"

export const Positions = () => {
  return (
    <AnalyticsSectionLayout
      Header={<Typography variant="Text lg/Regular">Positions</Typography>}
      Body={<BubbleChart />}
    />
  )
}

export const positions$ = data$
