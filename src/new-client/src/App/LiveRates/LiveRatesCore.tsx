import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { Tiles, tiles$ } from "./Tiles"
import { MainHeader, mainHeader$ } from "./MainHeader"
import { DraggableTearOut } from "@/components/DraggableTearOut"

export const liveRates$ = merge(tiles$, mainHeader$)

const LiveRates: React.FC = ({ children }) => (
  <Subscribe source$={liveRates$} fallback={children}>
    <DraggableTearOut section="liverates">
      <MainHeader />
      <Tiles />
    </DraggableTearOut>
  </Subscribe>
)

export default LiveRates
