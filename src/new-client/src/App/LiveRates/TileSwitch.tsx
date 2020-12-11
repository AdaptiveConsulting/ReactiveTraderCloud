import React from "react"
import { AnalyticsTile } from "./Tiles/AnalyticsTile/AnalyticsTile"
import { SpotTile } from "./Tiles/SpotTile/SpotTile"
import { TileView, useSelectedTileView } from "services/tiles"
interface Props {
  id: string
}

export const TileSwitch: React.FC<Props> = ({ id }) => {
  const tileView = useSelectedTileView()

  return (
    <>
      {tileView === TileView.Analytics ? (
        <AnalyticsTile id={id} />
      ) : (
        <SpotTile id={id} />
      )}
    </>
  )
}
