import { bind } from "@react-rxjs/core"
import { createListener } from "@react-rxjs/utils"
import { scan, tap } from "rxjs/operators"

export enum TileView {
  Normal = "normal",
  Analytics = "analytics",
}

const [toggleSelectedView$, onToggleSelectedView] = createListener()
export { onToggleSelectedView }

const SELECTED_VIEW_KEY = 'selectedView'

const initView = (window.localStorage.getItem(SELECTED_VIEW_KEY) as TileView) || TileView.Normal

export const [useSelectedTileView] = bind(
  toggleSelectedView$.pipe(
    scan(
      (acc) => (acc === TileView.Normal ? TileView.Analytics : TileView.Normal),
      initView,
    ),
    tap((newView) => {
      window.localStorage.setItem(SELECTED_VIEW_KEY, newView)
    })
  ),
  initView,
)
