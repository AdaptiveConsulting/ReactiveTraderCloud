import { Subscribe } from "@react-rxjs/core"
import styled from "styled-components"

import { isMobileDevice } from "@/client/utils"

import { AdminButton } from "./AdminButton"
import { Latency } from "./Latency"
import { LatencyHistoricalGraph } from "./LatencyHistoricalGraph"
import { Updates } from "./Updates"
import { UpdatesHistoricalGraph } from "./UpdatesHistoricalGraph"

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  opacity: 0.59;

  // Do not display in smaller screen sizes
  @media (max-width: 1024px) {
    display: none;
  }
  > div {
    margin-right: 10px;
  }
`

export const Stats = () => {
  const statsVisible = !isMobileDevice
  return statsVisible ? (
    <Subscribe>
      <Wrapper>
        <UpdatesHistoricalGraph />
        <Updates />
        <LatencyHistoricalGraph />
        <Latency />
        <AdminButton />
      </Wrapper>
    </Subscribe>
  ) : null
}
