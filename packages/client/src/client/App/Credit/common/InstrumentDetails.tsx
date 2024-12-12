import styled from "styled-components"

import { Typography } from "@/client/components/library/Typography"

import { CusipWithBenchmark } from "./CusipWithBenchmark"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

interface Props {
  name: string
  cusip: string
  benchmark: string
}

export const InstrumentDetails = ({ name, cusip, benchmark }: Props) => (
  <Wrapper>
    <Typography variant="Text md/Regular" data-testid="instrument-name">
      {name}
    </Typography>
    <CusipWithBenchmark cusip={cusip} benchmark={benchmark} />
  </Wrapper>
)
