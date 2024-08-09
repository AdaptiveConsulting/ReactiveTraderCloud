import { useLocation, useParams } from "react-router-dom"

import { DisconnectionOverlay } from "@/client/components/DisconnectionOverlay"
import { TearOutRouteWrapper } from "@/client/Web/Web.styles"

import { TileView } from "../selectedView"
import { TornOutTile } from "./TearOut/TornOutTile"

export const TornOutTileWrapper = () => {
  const { symbol } = useParams()
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const view = query.has("tileView")
    ? (query.get("tileView") as TileView)
    : TileView.Analytics

  return (
    <>
      <DisconnectionOverlay />
      <TearOutRouteWrapper>
        {symbol && <TornOutTile symbol={symbol} view={view} />}
      </TearOutRouteWrapper>
    </>
  )
}
