import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'
import { WindowConfig, WindowPosition } from 'rt-platforms'

type Center = 'screen' | 'parent'
export interface ExternalWindowProps {
  title: string
  config: WindowConfig
  browserConfig: { center: Center }
}

const makeExternalWindowProps: (key: string, tileLayout?: WindowPosition) => ExternalWindowProps = (
  key: string,
  tileLayout?: WindowPosition,
) => ({
  title: `${key} Spot`,
  config: {
    name: `${key}`,
    width: 366, // 346 content + 10 padding
    height: 193,
    minWidth: 366,
    minHeight: 193,
    maxWidth: 366,
    maxHeight: 193,
    url: `/spot/${key}`,
    x: tileLayout ? tileLayout.x : undefined,
    y: tileLayout ? tileLayout.y : undefined,
  },
  browserConfig: { center: 'screen' },
})

const getSpotTiles = (state: GlobalState) => state.currencyPairs
const getSpotTilesLayout = (state: GlobalState) => state.layoutService.spotTiles
const getSpotTilesData = (state: GlobalState) => state.spotTilesData

const isValueNullandUndefined = (value: object | undefined, properties: string) => typeof value![properties] !== 'undefined' && value![properties] !== null

// TODO: instead of creating tiles in the selector, consider creating them in the reducer for
  // reference data
export const selectSpotTiles = createSelector(
  [getSpotTiles, getSpotTilesLayout, getSpotTilesData],
  (spotTileKeys, tilesLayout, spotTilesData) =>
    Object.keys(spotTileKeys).map(key => {
      const hasData = typeof spotTilesData[key] !== 'undefined';
      const isRfqPriceNotNull = hasData && isValueNullandUndefined(spotTilesData[key], 'rfqPrice')

      return {
        key,
        externalWindowProps: makeExternalWindowProps(key, tilesLayout[key]),
        tornOff: tilesLayout[key] === undefined ? false : !tilesLayout[key].visible,
        rfqState: hasData ? spotTilesData[key]!.rfqState : 'none',
        rfqPrice: hasData ? {
          ask: isRfqPriceNotNull ? spotTilesData[key]!.rfqPrice!.ask : 0,
          bid: isRfqPriceNotNull ? spotTilesData[key]!.rfqPrice!.bid : 0,
          mid: isRfqPriceNotNull ? spotTilesData[key]!.rfqPrice!.mid : 0,
          creationTimestamp: isRfqPriceNotNull ? spotTilesData[key]!.rfqPrice!.creationTimestamp : 0,
          valueDate: isRfqPriceNotNull ? spotTilesData[key]!.rfqPrice!.valueDate : '',
        } : {
          ask: 0,
          bid: 0,
          mid: 0,
          creationTimestamp: 0,
          valueDate: ''
        },
        rfqReceivedTime: hasData && isValueNullandUndefined(spotTilesData[key], 'rfqReceivedTime') ? spotTilesData[key]!.rfqReceivedTime as number : 0, 
        rfqTimeout: hasData && isValueNullandUndefined(spotTilesData[key], 'rfqTimeout') ? spotTilesData[key]!.rfqTimeout as number : 0,
        notional: hasData && typeof spotTilesData[key]!.notional !== 'undefined' ? spotTilesData[key]!.notional as number : 0
      }
    })
)

export const selectSpotCurrencies = createSelector(
  [getSpotTiles],
  spotTileKeys => Array.from(new Set(Object.keys(spotTileKeys).map(key => spotTileKeys[key].base))),
)

const getExecutionStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.execution && compositeStatusService.execution.connectionStatus

export const selectExecutionStatus = createSelector(
  getExecutionStatus,
  status => status,
)
