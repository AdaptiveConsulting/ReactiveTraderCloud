import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { Tiles, tiles$ } from "./Tiles"
import { MainHeader, mainHeader$ } from "./MainHeader"
import { WithChildren } from "@/utils/utilityTypes"

export const liveRates$ = merge(tiles$, mainHeader$)

const LiveRates = ({ children }: WithChildren) => (
  <Subscribe source$={liveRates$} fallback={children}>
    <MainHeader />
    <Tiles />
  </Subscribe>
)

export default LiveRates
