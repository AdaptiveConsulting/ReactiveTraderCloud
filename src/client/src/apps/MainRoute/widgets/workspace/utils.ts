import { ExternalWindowProps } from './selectors'
import { TileViews } from './workspaceHeader'
import { RfqState } from '../spotTile/components/types'
import { SpotPriceTick } from '../spotTile/model/spotPriceTick'

export const appendTileViewToUrl: (
  externalWindowProps: ExternalWindowProps,
  tileView: TileViews,
  rfqState: RfqState,
  rfqPrice: SpotPriceTick | null,
  rfqReceivedTime: number | null,
  rfqTimeout: number | null,
  notional: number | undefined,
) => ExternalWindowProps = (
    externalWindowProps, 
    tileView, 
    rfqState, 
    rfqPrice, 
    rfqReceivedTime, 
    rfqTimeout, 
  notional
  ) => {
  const { config } = externalWindowProps
  const {ask, bid, mid} = rfqPrice || {}

  const url = config.url 
    + '?tileView=' + tileView 
    + '&rfqState=' + rfqState 
    + '&rfqAskPrice=' + ask 
    + '&rfqBidPrice=' + bid 
    + '&rfqMidPrice=' + mid 
    + '&rfqReceivedTime=' + rfqReceivedTime
    + '&rfqTimeout=' + rfqTimeout
    + '&notional=' + notional

  const newConfig = { ...config, url }
  return { ...externalWindowProps, config: newConfig }
}
