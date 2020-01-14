import { ExternalWindowProps } from './selectors'
import { TileViews } from './workspaceHeader'
import { RfqState } from '../spotTile/components/types'

export const appendTileViewToUrl: (
  externalWindowProps: ExternalWindowProps,
  tileView: TileViews,
  rfqState: RfqState,
  rfqPrice: {
    ask: number
    bid: number
    mid: number
    creationTimestamp: number
    valueDate: string
  } ,
  rfqReceivedTime: number,
  rfqTimeout: number,
  notional: number,
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
  const {ask, bid, mid, creationTimestamp, valueDate} = rfqPrice

  const url = config.url 
    + '?tileView=' + tileView 
    + '&rfqState=' + rfqState 
    + '&rfqAskPrice=' + ask 
    + '&rfqBidPrice=' + bid 
    + '&rfqMidPrice=' + mid 
    + '&rfqReceivedTime=' + rfqReceivedTime
    + '&rfqTimeout=' + rfqTimeout
    + '&rfqCreationTimestamp=' + creationTimestamp
    + '&rfqValueDate=' + valueDate
    + '&notional=' + notional

  const newConfig = { ...config, url }
  return { ...externalWindowProps, config: newConfig }
}
