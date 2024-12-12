import { merge } from "rxjs"
import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { SectionLayout } from "@/client/components/layout/SectionLayout"
import { Typography } from "@/client/components/library/Typography"

import { LastPosition, lastPosition$ } from "./LastPosition"
import { LineChart, lineChart$ } from "./LineChart"

const ProfitAndLossFlexBox = styled(FlexBox)`
  flex: 1;
  justifycontent: space-between;
`

export const ProfitAndLoss = () => (
  <SectionLayout
    Header={
      <ProfitAndLossFlexBox
        style={{ flex: 1, justifyContent: "space-between" }}
      >
        <Typography variant="Text lg/Regular">Profit &amp; Loss</Typography>
        <LastPosition />
      </ProfitAndLossFlexBox>
    }
    Body={<LineChart />}
  />
)

export const profitAndLoss$ = merge(lastPosition$, lineChart$)
