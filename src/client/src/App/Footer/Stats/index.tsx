import { Updates } from "./Updates"
import { Latency } from "./Latency"
import { UpdatesHistoricalGraph } from "./UpdatesHistoricalGraph"
import styled from "styled-components"
import { AdminButton } from "./AdminButton"
import { LatencyHistoricalGraph } from "./LatencyHistoricalGraph"
import { Subscribe } from "@react-rxjs/core"
import { isMobileDevice } from "@/utils"

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
