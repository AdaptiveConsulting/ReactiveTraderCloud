import { PortalProps } from './selectors'
import { TileViews } from './workspaceHeader/index'

export const appendTileViewToUrl: (portalProps: PortalProps, tileView: TileViews) => PortalProps = (
  portalProps,
  tileView,
) => {
  const { config } = portalProps
  const url = config.url + '?tileView=' + tileView
  const newConfig = { ...config, url }
  return { ...portalProps, config: newConfig }
}
