import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { scan, tap } from "rxjs/operators"

export enum TileView {
  Normal = "Normal",
  Analytics = "Analytics",
}

const [toggleSelectedView$, onToggleSelectedView] = createSignal()
export { onToggleSelectedView }

export const SELECTED_VIEW_KEY = "selectedView"

export const getInitView = () =>
  (window.localStorage.getItem(SELECTED_VIEW_KEY) as TileView) ||
  TileView.Analytics

export const [useSelectedTileView] = bind(
  (initView: TileView) =>
    toggleSelectedView$.pipe(
      scan(
        (acc) =>
          acc === TileView.Normal ? TileView.Analytics : TileView.Normal,
        initView,
      ),
      tap((newView) => {
        window.localStorage.setItem(SELECTED_VIEW_KEY, newView)
      }),
    ),
  (initView: TileView) => initView,
)
