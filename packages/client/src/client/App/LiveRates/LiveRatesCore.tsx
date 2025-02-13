import { useEffect } from "react"
import { merge } from "rxjs"

import { Region } from "@/client/components/layout/Region"
import {
  registerFxTradeNotifications,
  unregisterFxTradeNotifications,
} from "@/client/notifications"
import { WithChildren } from "@/client/utils/utilityTypes"

import { LiveRatesHeader, mainHeader$ } from "./LiveRatesHeader"
import { Tiles, tiles$ } from "./Tiles"

export const liveRates$ = merge(tiles$, mainHeader$)

const LiveRates = ({ children }: WithChildren) => {
  useEffect(() => {
    registerFxTradeNotifications()
    return () => {
      unregisterFxTradeNotifications()
    }
  }, [])

  return (
    <Region
      source$={liveRates$}
      fallback={children}
      Header={<LiveRatesHeader />}
      Body={<Tiles />}
    />
  )
}

export default LiveRates
