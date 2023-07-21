import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { timer } from "rxjs"
import { scan } from "rxjs/operators"

import { currencyPairs$ } from "@/client/services/currencyPairs"
import { getPriceUpdates$ } from "@/client/services/prices"

const MAX_SECONDS = 60
const [updatesPerSecond$, setUpdatesPerSecond] = createSignal<number>()
export const [useUpdatesPerSecond] = bind(updatesPerSecond$, 0)
export const [useUpdatesPerSecondHistory, updatesPerSecondHistory$] = bind(
  updatesPerSecond$.pipe(
    scan(
      (acc, value) => {
        acc.push(value)
        if (acc.length > MAX_SECONDS) {
          acc.splice(0, 1)
        }
        return [...acc]
      },
      [0],
    ),
  ),
)

currencyPairs$.subscribe((currencyPairs) => {
  let count = 0

  Object.keys(currencyPairs).forEach((symbol) => {
    getPriceUpdates$(symbol).subscribe(() => {
      count++
    })
  })

  timer(1000, 1000).subscribe(() => {
    setUpdatesPerSecond(count)
    count = 0
  })
})

export const Updates = () => {
  const count = useUpdatesPerSecond()

  return (
    <div>
      UI Updates: <span>{count}/sec</span>
    </div>
  )
}
