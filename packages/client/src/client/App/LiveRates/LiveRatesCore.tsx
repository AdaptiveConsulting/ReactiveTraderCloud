import { Subscribe } from "@react-rxjs/core"
import { merge } from "rxjs"

import { WithChildren } from "@/client/utils/utilityTypes"

import { MainHeader, mainHeader$ } from "./MainHeader"
import { Tiles, tiles$ } from "./Tiles"

console.log("----- LiveRatesCore -----")
export const liveRates$ = merge(tiles$, mainHeader$)

const LiveRates = ({ children }: WithChildren) => {
  return (
    <Subscribe source$={liveRates$} fallback={children}>
      <MainHeader />
      <Tiles />
    </Subscribe>
  )
}

export default LiveRates
