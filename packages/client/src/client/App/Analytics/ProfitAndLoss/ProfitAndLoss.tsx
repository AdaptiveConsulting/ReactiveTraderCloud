import { merge } from "rxjs"
import styled from "styled-components"

import { AnalyticsSectionLayout } from "@/client/components/layout/AnalyticsSectionLayout"
import { Typography } from "@/client/components/Typography"

import { LastPosition, lastPosition$ } from "./LastPosition"
import { LineChart, lineChart$ } from "./LineChart"
import { Stack } from "@/client/components/Stack"

const ProfitAndLossFlexBox = styled(Stack)`
  flex: 1;
`

export const ProfitAndLoss = () => (
  <AnalyticsSectionLayout
    Header={
      <ProfitAndLossFlexBox justifyContent="space-between" alignItems="center">
        <Typography variant="Text lg/Regular">Profit &amp; Loss</Typography>
        <LastPosition />
      </ProfitAndLossFlexBox>
    }
    Body={<LineChart />}
  />
)

export const profitAndLoss$ = merge(lastPosition$, lineChart$)
