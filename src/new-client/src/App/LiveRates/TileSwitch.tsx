import { memo } from "react"
import styled from "styled-components/macro"
import { AnalyticsTile } from "./Tiles/AnalyticsTile/AnalyticsTile"
import { SpotTile } from "./Tiles/SpotTile/SpotTile"

interface Props {
  id: string
}

const PanelItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
`

export const TileSwitch: React.FC<Props> = memo(({ id }) => {
  const isAnalytics = true

  return (
    <PanelItem>
      {isAnalytics ? <AnalyticsTile id={id} /> : <SpotTile id={id} />}
    </PanelItem>
  )
})
