import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { Tiles, tiles$ } from "./Tiles"
import { MainHeader, mainHeader$ } from "./MainHeader"
import { DraggableComponent } from "@/components/DraggableComponent"

export const liveRates$ = merge(tiles$, mainHeader$)

const LiveRates: React.FC = ({ children }) => (
  <Subscribe source$={liveRates$} fallback={children}>
    <DraggableComponent section="liverates">
      <MainHeader />
      <Tiles />
    </DraggableComponent>
  </Subscribe>
)

export default LiveRates
