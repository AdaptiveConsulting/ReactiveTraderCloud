import styled from "styled-components"

import { HistoricalGraphComponent } from "@/client/App/LiveRates/Tile/HistoricalGraph"

import { PATH } from "../../path"

interface Props {
  active: boolean
}

const Container = styled.div`
  pointer-events: none;
`

export const AtomsChart = ({ active }: Props) => (
  <Container>
    <HistoricalGraphComponent
      showTimer={false}
      path={PATH}
      active={active}
      showCenterLine
    />
  </Container>
)
