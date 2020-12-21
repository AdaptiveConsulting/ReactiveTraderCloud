import { bind } from "@react-rxjs/core"
import { createListener } from "@react-rxjs/utils"
import { scan } from "rxjs/operators"

export enum TileView {
  Normal = "normal",
  Analytics = "analytics",
}

const [toggleSelectedView$, onToggleSelectedView] = createListener()
export { onToggleSelectedView }

export const [useSelectedTileView] = bind(
  toggleSelectedView$.pipe(
    scan(
      (acc) => (acc === TileView.Normal ? TileView.Analytics : TileView.Normal),
      TileView.Normal,
    ),
  ),
  TileView.Normal,
)
