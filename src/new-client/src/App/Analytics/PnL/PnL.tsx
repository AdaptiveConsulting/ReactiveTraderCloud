import { bind } from "@react-rxjs/core"
import { distinctUntilChanged, map } from "rxjs/operators"
import { currentPositions$ } from "services/analytics"
import { equals } from "utils/equals"
import { mapObject } from "utils/mapObject"
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

export const PnL: React.FC = () => (
  <div>
    <Title>PnL</Title>
    {usePnL().map((pnlItem) => (
      <PNLBar {...pnlItem} />
    ))}
  </div>
)
