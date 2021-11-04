import styled from "styled-components"
import { PriceMovementType } from "@/services/prices"
import { PriceMovementComponent } from "@/App/LiveRates/Tile/PriceMovement/PriceMovement"
import { Root, LabelColumn, SpreadTilesColumn, SpreadTilesRow } from "./Styles"

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
        {/*
        //@ts-ignore */}
        <PriceMovementComponent
          movementType={PriceMovementType.DOWN}
          spread="3.0"
          isAnalyticsView={false}
        />
      </SpreadTilesRow>
      <SpreadTilesRow>
        {/*
        //@ts-ignore */}
        <PriceMovementComponent
          movementType={PriceMovementType.UP}
          spread="3.0"
          isAnalyticsView={false}
        />
      </SpreadTilesRow>
    </SpreadTilesColumn>
  </Root>
)) as React.FC
