import styled from "styled-components"

import { OverlayDiv } from "@/client/components/OverlayDiv"

import { TileState } from "../Tile.state"

export const ExecutionStatusAlertContainer = styled(OverlayDiv)<{
  state: TileState
}>`
  position: absolute;
`
