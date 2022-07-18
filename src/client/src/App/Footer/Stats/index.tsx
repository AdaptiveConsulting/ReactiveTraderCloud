import { Updates } from "./Updates"
import { Latency } from "./Latency"
import { UpdatesHistoricalGraph } from "./UpdatesHistoricalGraph"
import styled from "styled-components"
import { AdminButton } from "./AdminButton"
import { LatencyHistoricalGraph } from "./LatencyHistoricalGraph"

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  opacity: 0.59;

  > div {
    margin-right: 10px;
  }
`

export const Stats = () => (
  <Wrapper>
    <UpdatesHistoricalGraph />
    <Updates />
    <LatencyHistoricalGraph />
    <Latency />
    <AdminButton />
  </Wrapper>
)
