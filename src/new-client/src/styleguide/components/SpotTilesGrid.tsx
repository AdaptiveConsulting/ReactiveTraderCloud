import styled from "styled-components"
import { H3 } from "../elements"
import {
  spotTileData,
  currencyPair,
  rfqStateReceived,
} from "./SpotTilesMockData"
import { TileComponent } from "@/App/LiveRates/Tile/Tile"

const Grid = styled.div`
  display: grid;
  grid-template-columns: 120px 320px 320px;
  grid-column-gap: 43px;
  grid-row-gap: 17px;
`
const Cell = styled.div`
  display: grid;
  grid-template-rows: 15px 175px;
  grid-row-gap: 9px;
`
const FxSpot = styled.div`
  grid-row: 1 / span 2;
`
const FxRfq = styled.div`
  grid-row: 4 / span 4;
`
const Separator = styled.hr`
  grid-column: 1 / -1;
  border: none;
  border-bottom: ${({ theme }) =>
    `2px solid ${theme.core.primaryStyleGuideBackground}`};
  margin: 4rem 0;
`
const genericProps = {
  spotTileData: spotTileData,
  currencyPair: currencyPair,
}
const SpotTilesGrid = () => (
  <>
    <H3>Trading Tiles - Horizontal</H3>
    <Grid>
      <FxSpot>FX Spot</FxSpot>
      <Cell>
        <span>Normal</span>
        <TileComponent {...genericProps} />
      </Cell>
      <Cell>
        <span>Hover</span>
        <TileComponent {...genericProps} supportsTearOut={true} hover={true} />
      </Cell>
      <Cell>
        <span>Price Unavailable</span>
        <TileComponent {...genericProps} disabledInput={true} isStale={true} />
      </Cell>
      <Cell>
        <span>Executing</span>
        <TileComponent
          {...genericProps}
          disabledInput={true}
          hover={true}
          isExecuting={true}
          faded={true}
        />
      </Cell>
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      <Cell>
        <span>Begin Price Request</span>
        <TileComponent
          {...genericProps}
          hover={true}
          faded={true}
          resetInput={true}
          buttonText={"Initiate RFQ"}
        />
      </Cell>
      <Cell>
        <span>Awaiting Price</span>
        <TileComponent
          {...genericProps}
          hover={true}
          awaiting={true}
          disabledInput={true}
          buttonText={"Cancel RFQ"}
        />
      </Cell>
      <Cell>
        <span>Price Announced</span>
        <TileComponent
          {...genericProps}
          hover={false}
          activeColorLeft={true}
          activeColorRight={true}
          disabledInput={true}
          startTimer={60}
        />
      </Cell>
      <Cell>
        <span>Priced</span>
        <TileComponent
          {...genericProps}
          hover={false}
          disabledInput={true}
          startTimer={49}
          rfqStateLeft={rfqStateReceived}
          rfqStateRight={rfqStateReceived}
        />
      </Cell>
      <Cell>
        <span>Priced Hover</span>
        <TileComponent
          {...genericProps}
          hover={false}
          disabledInput={true}
          startTimer={49}
          activeColorLeft={true}
          rfqStateRight={rfqStateReceived}
        />
      </Cell>
      <Cell>
        <span>Price Expired</span>
        <TileComponent
          {...genericProps}
          hover={true}
          buttonText={"Requote"}
          faded={true}
          resetInput={true}
          isExpired={true}
        />
      </Cell>
    </Grid>
    <Separator />
    <H3>Trading Tiles - Vertical</H3>
    <Grid>
      <FxSpot>FX Spot</FxSpot>
      <Cell>
        <span>Normal</span>
        <TileComponent isAnalytics={true} {...genericProps} />
      </Cell>
      <Cell>
        <span>Hover</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          supportsTearOut={true}
          hover={true}
        />
      </Cell>
      <Cell>
        <span>Price Unavailable</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          disabledInput={true}
          isStale={true}
        />
      </Cell>
      <Cell>
        <span>Executing</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          disabledInput={true}
          hover={true}
          isExecuting={true}
          faded={true}
        />
      </Cell>
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      <Cell>
        <span>Begin Price Request</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          hover={true}
          faded={true}
          resetInput={true}
          buttonText={"Initiate RFQ"}
        />
      </Cell>
      <Cell>
        <span>Awaiting Price</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          hover={true}
          awaiting={true}
          disabledInput={true}
          buttonText={"Cancel RFQ"}
        />
      </Cell>
      <Cell>
        <span>Price Announced</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          hover={false}
          activeColorLeft={true}
          activeColorRight={true}
          disabledInput={true}
          startTimer={60}
        />
      </Cell>
      <Cell>
        <span>Priced</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          hover={false}
          disabledInput={true}
          startTimer={49}
          rfqStateLeft={rfqStateReceived}
          rfqStateRight={rfqStateReceived}
        />
      </Cell>
      <Cell>
        <span>Priced Hover</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          hover={false}
          disabledInput={true}
          startTimer={49}
          activeColorLeft={true}
          rfqStateRight={rfqStateReceived}
        />
      </Cell>
      <Cell>
        <span>Price Expired</span>
        <TileComponent
          isAnalytics={true}
          {...genericProps}
          hover={true}
          buttonText={"Requote"}
          faded={true}
          resetInput={true}
          isExpired={true}
        />
      </Cell>
    </Grid>
  </>
)

export default SpotTilesGrid
