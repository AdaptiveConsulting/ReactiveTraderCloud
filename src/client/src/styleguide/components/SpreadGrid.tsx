import { FC } from "react"
import styled from "styled-components"
import { PriceMovementType } from "@/services/prices"
import { PriceMovementInner } from "@/App/LiveRates/Tile/PriceMovement"

export default (() => (
  <Root>
    <LabelColumn>
      <div>Spread</div>
      <label>Tick Down</label>
      <label>Tick Up</label>
    </LabelColumn>
    <SpreadTilesColumn>
      <SpreadTilesRow />
      <SpreadTilesRow>
        <PriceMovementVariants direction={PriceMovementType.DOWN} />
      </SpreadTilesRow>
      <SpreadTilesRow>
        <PriceMovementVariants direction={PriceMovementType.UP} />
      </SpreadTilesRow>
    </SpreadTilesColumn>
  </Root>
)) as FC

const PriceMovementVariants: FC<{ direction: PriceMovementType }> = ({
  direction,
}) => (
  <PriceMovementInner
    movementType={direction}
    spread="3.0"
    isAnalyticsView={false}
  />
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 2rem repeat(2, 1fr);
  grid-row-gap: 0.5rem;
  align-items: center;
  justify-content: flex-start;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
  & > div {
    font-size: 0.875rem;
  }
`

const SpreadTilesColumn = styled(GridColumn)`
  min-width: 10rem;
`
const SpreadTilesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 0.5rem;
`

const Root = styled.div`
  max-width: 60rem;
  display: grid;
  grid-template-columns: minmax(auto, 80px) 1fr;
  grid-column-gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.primary[3]};

  ${SpreadTilesColumn} + ${SpreadTilesColumn} {
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
