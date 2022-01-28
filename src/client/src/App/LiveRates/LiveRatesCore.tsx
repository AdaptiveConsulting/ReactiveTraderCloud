import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { Tiles, tiles$ } from "./Tiles"
import { MainHeader, mainHeader$ } from "./MainHeader"

export const liveRates$ = merge(tiles$, mainHeader$)

const LiveRates: React.FC = ({ children }) => (
  <Subscribe source$={liveRates$} fallback={children}>
    <MainHeader />
    <Tiles />
  </Subscribe>
)

export default LiveRates
