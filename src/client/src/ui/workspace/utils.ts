import { ExternalWindowProps } from './selectors'
import { TileViews } from './workspaceHeader/index'

export const appendTileViewToUrl: (
  externalWindowProps: ExternalWindowProps,
  tileView: TileViews,
) => ExternalWindowProps = (externalWindowProps, tileView) => {
  const { config } = externalWindowProps
  const url = config.url + '?tileView=' + tileView
  const newConfig = { ...config, url }
  return { ...externalWindowProps, config: newConfig }
}
