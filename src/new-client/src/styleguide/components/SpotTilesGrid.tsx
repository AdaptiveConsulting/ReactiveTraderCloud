import styled from "styled-components"
import { H3 } from "../elements"
import {
  spotTileData,
  currencyPair,
  rfqStateReceived,
  FXSpotHoritzontalVariants,
  FXSpotVerticalVariants,
  FXRFQHoritzontalVariants,
  FXRFQVerticalVariants,
} from "./SpotTilesMockData"
import { TileMockComponent } from "@/App/LiveRates/Tile/Tile"

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
      {FXSpotHoritzontalVariants.map((element) => {
        return (
          <Cell>
            <span>{element.title}</span>
            <TileMockComponent {...genericProps} {...element.props} />
          </Cell>
        )
      })}
      <Separator />
      <FxRfq>FX RFQ</FxRfq>
      {FXRFQHoritzontalVariants.map((element) => {
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
      {FXSpotVerticalVariants.map((element) => {
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
      {FXRFQVerticalVariants.map((element) => {
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
