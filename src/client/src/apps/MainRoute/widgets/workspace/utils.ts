import { ExternalWindowProps } from './selectors'
import { TileView } from './workspaceHeader'

export const appendTileViewToUrl: (
  externalWindowProps: ExternalWindowProps,
  tileView: TileView,
) => ExternalWindowProps = (externalWindowProps, tileView) => {
  const { config } = externalWindowProps
  const url = config.url + '?tileView=' + tileView
  const newConfig = { ...config, url }
  return { ...externalWindowProps, config: newConfig }
}
