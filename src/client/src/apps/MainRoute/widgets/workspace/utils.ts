import { ExternalWindowProps } from './selectors'
import { TileView } from './workspaceHeader'
import { SpotTileData } from '../spotTile/model'

export const appendTileViewToUrl: (
  externalWindowProps: ExternalWindowProps,
  tileView: TileView,
  data?: SpotTileData,
) => ExternalWindowProps = (externalWindowProps, tileView, data) => {
  const { config } = externalWindowProps
  const url = `${config.url}?tileView=${tileView}${
    data?.notional ? `&notional=${data?.notional}` : ''
  }`
  const newConfig = { ...config, url }
  return { ...externalWindowProps, config: newConfig }
}
