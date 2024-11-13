import { SectionLayout } from "@/client/components/layout/SectionLayout"
import { Typography } from "@/client/components/Typography"

import { BubbleChart } from "./BubbleChart"
import { data$ } from "./data"

export const Positions = () => {
  return (
    <SectionLayout
      Header={<Typography variant="Text lg/Regular">Positions</Typography>}
      Body={<BubbleChart />}
    />
  )
}

export const positions$ = data$
