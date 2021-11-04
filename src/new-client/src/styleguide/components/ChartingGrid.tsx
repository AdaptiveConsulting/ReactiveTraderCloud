import styled from "styled-components"
import {
  LineChartWrapper,
  GraphNotionalWrapperDummy,
} from "@/App/LiveRates/Tile/Tile.styles"
import { HistoricalGraphComponent } from "@/App/LiveRates/Tile/HistoricalGraph/HistoricalGraph"
import { PriceMovementType } from "@/services/prices"
import { getDataPoints, toSvgPath, withScales } from "@/utils/historicalChart"
import { HistoryPrice } from "@/services/prices"
import { curveBasis } from "d3"

interface SpotPriceTick {
  ask: number
  bid: number
  mid: number
  creationTimestamp: number
  symbol: string
  valueDate: string
  priceMovementType?: PriceMovementType
  priceStale?: boolean
}

const priceTick: SpotPriceTick = {
  ask: 12.5,
  bid: 14.0,
  mid: 13.0,
  creationTimestamp: 20052,
  symbol: "EURCAD",
  valueDate: "2018-08-04T00:00:00Z",
  priceMovementType: PriceMovementType.UP,
  priceStale: true,
}
const generateHistoricPrices: (totalPricePrick: number) => SpotPriceTick[] = (
  totalPricePrick,
) => {
  const historicPrices = []
  for (let counter = 0; counter < totalPricePrick; counter++) {
    const mid = Math.random() * priceTick.mid
    const finalMid = Math.random() < 0.3 ? mid * -1 + 0.5 : mid
    historicPrices.push({ ...priceTick, mid: finalMid })
  }

  return historicPrices
}

const history = generateHistoricPrices(30)
const dataPoints = getDataPoints<HistoryPrice>((price, idx) => [
  new Date(idx),
  price.mid,
])(history)
const scales = withScales([0, 200], [0, 90])(dataPoints)
const HistoryMockSvgPath = toSvgPath(curveBasis)(scales)

export default (() => (
  <Root>
    <LabelColumn>
      <div>Charting</div>
      <label>Normal</label>
      <label>Active</label>
    </LabelColumn>
    <ChartingColumn>
      <ChartingRow />
      <ChartingRow>
        <ChartsVariants />
      </ChartingRow>
      <ChartingRow>
        <ChartsVariants active />
      </ChartingRow>
    </ChartingColumn>
  </Root>
)) as React.FC

const ChartsVariants: React.FC<{ active?: boolean }> = ({ active = false }) => (
  <>
    <ChartingContainer>
      <GraphNotionalWrapperDummy isTimerOn={true}>
        <LineChartWrapper isTimerOn={true}>
          <HistoricalGraphComponent
            history={HistoryMockSvgPath}
            showTimer={true}
            active={active}
            // isAtom={true}
          />
        </LineChartWrapper>
      </GraphNotionalWrapperDummy>
    </ChartingContainer>
  </>
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 2rem 1fr 1fr;
  grid-row-gap: 0.5rem;
  align-items: center;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary[1]};

  & > div {
    font-size: 0.875rem;
  }
`

const ChartingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;
`
const ChartingColumn = styled(GridColumn)`
  min-width: 10rem;
`

const ChartingContainer = styled.div`
  width: 200px;
  display: flex;
  height: 100px;
  justify-content: space-between;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: minmax(auto, 80px) 1fr;
  grid-column-gap: 2rem;

  padding-bottom: 2rem;

  ${ChartingColumn} + ${ChartingColumn} {
    position: relative;

    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`
