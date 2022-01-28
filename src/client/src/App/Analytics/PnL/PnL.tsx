import { bind } from "@react-rxjs/core"
import { distinctUntilChanged, map } from "rxjs/operators"
import { currentPositions$ } from "@/services/analytics"
import { equals } from "@/utils/equals"
import { mapObject } from "@/utils/mapObject"
import { Title } from "../styled"
import PNLBar from "./PNLBar"

const [usePnL, pnL$] = bind(
  currentPositions$.pipe(
    map((positions) => mapObject(positions, (position) => position.basePnl)),
    distinctUntilChanged(equals),
    map((basePnlsDict) => {
      const basePnls = Object.values(basePnlsDict)
      const max = Math.max(...basePnls)
      const min = Math.min(...basePnls)
      const maxVal = Math.max(Math.abs(max), Math.abs(min))

      return Object.entries(basePnlsDict).map(([symbol, basePnl]) => ({
        key: symbol,
        symbol,
        basePnl,
        maxVal,
      }))
    }),
  ),
)

export { pnL$ }

export const PnLInner: React.FC<{
  data: {
    key: string
    symbol: string
    basePnl: number
    maxVal: number
  }[]
}> = ({ data }) => (
  <div>
    <Title>PnL</Title>
    {data.map((pnlItem) => (
      <PNLBar {...pnlItem} />
    ))}
  </div>
)

export const PnL: React.FC = () => {
  const data = usePnL()
  return <PnLInner data={data} />
}
