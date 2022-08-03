import { Loader } from "@/components/Loader"
import { FxTrade, isBlotterDataStale$, trades$ } from "@/services/trades"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"
import { broadcast } from "@finos/fdc3"
import { Subscribe } from "@react-rxjs/core"
import { useCallback } from "react"
import styled from "styled-components"
import { ColDefContext, ColFieldsContext, Trades$Context } from "./Context"
import { TradesFooter } from "./TradesFooter"
import { TradesGridInner, TradesGridInnerProps } from "./TradesGrid"
import { TradesHeader } from "./TradesHeader"
import { useTradeRowHighlight } from "./TradesState"
import { fxColDef, fxColFields } from "./TradesState/colConfig"

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const SuspenseOnStaleData = createSuspenseOnStale(isBlotterDataStale$)

const TradesGrid: React.FC<TradesGridInnerProps<FxTrade>> = (props) => {
  const highlightedRow = useTradeRowHighlight()
  const tryBroadcastContext = useCallback((trade: FxTrade) => {
    const context = {
      type: "fdc3.instrument",
      id: { ticker: trade.symbol },
    }

    if (window.fdc3) {
      broadcast(context)
    } else if (window.fin) {
      // @ts-ignore
      fin.me.interop.setContext(context)
    }
  }, [])

  const isRowCrossed = useCallback((row: FxTrade) => {
    return row.status === "Rejected"
  }, [])
  return (
    <TradesGridInner
      onRowClick={tryBroadcastContext}
      isRowCrossed={isRowCrossed}
      highlightedRow={highlightedRow}
      {...props}
    />
  )
}

const FxTrades: React.FC = () => {
  return (
    <Subscribe fallback={<Loader ariaLabel="Loading trades blotter" />}>
      <ColFieldsContext.Provider value={fxColFields}>
        <ColDefContext.Provider value={fxColDef}>
          <Trades$Context.Provider value={trades$}>
            <SuspenseOnStaleData />
            <TradesStyle role="region" aria-labelledby="trades-table-heading">
              <TradesHeader section="blotter" />
              <TradesGrid />
              <TradesFooter />
            </TradesStyle>
          </Trades$Context.Provider>
        </ColDefContext.Provider>
      </ColFieldsContext.Provider>
    </Subscribe>
  )
}

export default FxTrades
