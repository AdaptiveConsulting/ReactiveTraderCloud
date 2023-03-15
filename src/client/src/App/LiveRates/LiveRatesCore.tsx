import { Subscribe } from "@react-rxjs/core"
import { merge } from "rxjs"

import { WithChildren } from "@/utils/utilityTypes"

import { MainHeader, mainHeader$ } from "./MainHeader"
import { Tiles, tiles$ } from "./Tiles"

export const liveRates$ = merge(tiles$, mainHeader$)

const LiveRates = ({ children }: WithChildren) => (
  <Subscribe source$={liveRates$} fallback={children}>
    <MainHeader />
    <Tiles />
  </Subscribe>
)

export default LiveRates
