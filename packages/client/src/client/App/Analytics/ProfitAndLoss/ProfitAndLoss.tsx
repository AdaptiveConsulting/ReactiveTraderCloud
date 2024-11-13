import { merge } from "rxjs"

import { FlexBox } from "@/client/components/FlexBox"
import { SectionLayout } from "@/client/components/layout/SectionLayout"
import { Typography } from "@/client/components/Typography"

import { LastPosition, lastPosition$ } from "./LastPosition"
import { LineChart, lineChart$ } from "./LineChart"

export const ProfitAndLoss = () => (
  <SectionLayout
    Header={
      <FlexBox style={{ flex: 1, justifyContent: "space-between" }}>
        <Typography variant="Text lg/Regular">Profit &amp; Loss</Typography>
        <LastPosition />
      </FlexBox>
    }
    Body={<LineChart />}
  />
)

export const profitAndLoss$ = merge(lastPosition$, lineChart$)
