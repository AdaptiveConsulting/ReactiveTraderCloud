import { H3 } from "../elements"
import {
  FXSpotVariants,
  FXRFQVariants,
  genericTileProps,
} from "./SpotTilesMockData"
import { TileMockComponent } from "@/App/LiveRates/Tile/Tile"
import { Grid, FxRfq, Separator, Cell, FxSpot } from "./Styles"
const SpotTilesGrid = () => (
  <>
    <H3>Trading Tiles - Horizontal</H3>
    <Grid>
      <FxSpot>FX Spot</FxSpot>
      {FXSpotVariants.map((element, index) => {
        return (
          <Cell key={index}>
            <span>{element.title}</span>
            <TileMockComponent {...genericTileProps} {...element.props} />
          </Cell>
        )
      })}
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      {FXRFQVariants.map((element, index) => {
        return (
          <Cell key={index}>
            <span>{element.title}</span>
            <TileMockComponent {...genericTileProps} {...element.props} />
          </Cell>
        )
      })}
    </Grid>
    <Separator />
    <H3>Trading Tiles - Vertical</H3>
    <Grid>
      <FxSpot>FX Spot</FxSpot>
      {FXSpotVariants.map((element, index) => {
        return (
          <Cell key={index}>
            <span>{element.title}</span>
            <TileMockComponent
              {...genericTileProps}
              {...element.props}
              isAnalytics
            />
          </Cell>
        )
      })}
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      {FXRFQVariants.map((element, index) => {
        return (
          <Cell key={index}>
            <span>{element.title}</span>
            <TileMockComponent
              {...genericTileProps}
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
