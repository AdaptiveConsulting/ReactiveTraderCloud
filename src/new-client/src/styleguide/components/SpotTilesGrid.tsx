import styled from "styled-components"
import { H3 } from "../elements"
import {
  spotTileData,
  currencyPair,
  rfqStateReceived,
  FXSpotVariants,
  FXRFQVariants,
} from "./SpotTilesMockData"
import { TileMockComponent } from "@/App/LiveRates/Tile/Tile"
import { Grid, FxRfq, Separator, Cell, FxSpot } from "./Styles"
const genericProps = {
  spotTileData: spotTileData,
  currencyPair: currencyPair,
}
const SpotTilesGrid = () => (
  <>
    <H3>Trading Tiles - Horizontal</H3>
    <Grid>
      <FxSpot>FX Spot</FxSpot>
      {FXSpotVariants.map((element) => {
        return (
          <Cell>
            <span>{element.title}</span>
            <TileMockComponent {...genericProps} {...element.props} />
          </Cell>
        )
      })}
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      {FXRFQVariants.map((element) => {
        return (
          <Cell>
            <span>{element.title}</span>
            <TileMockComponent {...genericProps} {...element.props} />
          </Cell>
        )
      })}
    </Grid>
    <Separator />
    <H3>Trading Tiles - Vertical</H3>
    <Grid>
      <FxSpot>FX Spot</FxSpot>
      {FXSpotVariants.map((element) => {
        return (
          <Cell>
            <span>{element.title}</span>
            <TileMockComponent
              {...genericProps}
              {...element.props}
              isAnalytics
            />
          </Cell>
        )
      })}
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      {FXRFQVariants.map((element) => {
        return (
          <Cell>
            <span>{element.title}</span>
            <TileMockComponent
              {...genericProps}
              {...element.props}
              isAnalytics
            />
          </Cell>
        )
      })}
    </Grid>
  </>
)

export default SpotTilesGrid
