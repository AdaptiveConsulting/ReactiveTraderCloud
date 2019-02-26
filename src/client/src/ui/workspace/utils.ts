import { ExternalWindowProps } from './selectors'
import { TileViews } from './workspaceHeader/index'

export const appendTileViewToUrl: (portalProps: ExternalWindowProps, tileView: TileViews) => ExternalWindowProps = (
  portalProps,
  tileView,
) => {
  const { config } = portalProps
  const url = config.url + '?tileView=' + tileView
  const newConfig = { ...config, url }
  return { ...portalProps, config: newConfig }
}
