import { Updates } from "./Updates"
import { Latency } from "./Latency"
import { UpdatesHistoricalGraph } from "./UpdatesHistoricalGraph"
import styled from "styled-components"

const Wrapper = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;

  > div {
    margin-right: 10px;
  }
`

export const Stats = () => (
  <Wrapper>
    <UpdatesHistoricalGraph />
    <Updates />
    <Latency />
  </Wrapper>
)
