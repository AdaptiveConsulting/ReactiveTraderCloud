import { bind } from "@react-rxjs/core"
import { distinctUntilChanged, map } from "rxjs/operators"
import styled from "styled-components"

import { AnalyticsSectionLayout } from "@/client/components/layout/AnalyticsSectionLayout"
import { equals } from "@/client/utils/equals"
import { mapObject } from "@/client/utils/mapObject"
import { currentPositions$ } from "@/services/analytics"

import PNLBar, { PNLBarProps } from "./PNLBar"

const [usePnL, pnL$] = bind(
  currentPositions$.pipe(
    map((positions) => mapObject(positions, (position) => position.basePnl)),
    distinctUntilChanged(equals),
    map((basePnlsDict) => {
      const profitOrLossValues = Object.values(basePnlsDict)
      const max = Math.max(...profitOrLossValues)
      const min = Math.min(...profitOrLossValues)
      const largestProfitOrLossValue = Math.max(Math.abs(max), Math.abs(min))

      return Object.entries(basePnlsDict).map(
        ([symbol, profitOrLossValue]) => ({
          symbol,
          profitOrLossValue,
          largestProfitOrLossValue,
        }),
      )
    }),
  ),
)

export { pnL$ }

const PnLSectionLayout = styled(AnalyticsSectionLayout)`
  overflow: hidden;
  padding-bottom: ${({ theme }) => theme.newTheme.spacing.lg};
`

export const PnLInner = ({ data }: { data: PNLBarProps[] }) => (
  <PnLSectionLayout
    Header="PnL"
    Body={data.map((pnlItem) => (
      <PNLBar key={pnlItem.symbol} {...pnlItem} />
    ))}
  />
)

export const PnL = () => {
  const data = usePnL()
  return <PnLInner data={data} />
}
