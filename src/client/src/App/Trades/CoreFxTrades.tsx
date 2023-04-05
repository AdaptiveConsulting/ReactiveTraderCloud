import { broadcast, joinChannel } from "@finos/fdc3"
import { Subscribe } from "@react-rxjs/core"
import { useCallback, useEffect } from "react"
import styled from "styled-components"

import { Loader } from "@/components/Loader"
import { FxTrade, isBlotterDataStale$, trades$ } from "@/services/trades"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"

import { ColDefContext, ColFieldsContext, TradesStreamContext } from "./Context"
import { TradesFooter } from "./TradesFooter"
import { TradesGridInner, TradesGridInnerProps } from "./TradesGrid"
import { TradesHeader } from "./TradesHeader"
import { useFxTradeRowHighlight } from "./TradesState"
import { fxColDef, fxColFields } from "./TradesState/colConfig"

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const SuspenseOnStaleData = createSuspenseOnStale(isBlotterDataStale$)

const TradesGrid = (props: TradesGridInnerProps<FxTrade>) => {
  const highlightedRow = useFxTradeRowHighlight()

  useEffect(() => {
    if (window.fdc3) {
      // https://developer.openfin.co/docs/javascript/stable/tutorial-fdc3.joinChannel.html
      joinChannel("green") //async
    }
  }, [])
  const tryBroadcastContext = useCallback((trade: FxTrade) => {
    const context = {
      type: "fdc3.instrument",
      id: { ticker: trade.symbol },
    }
    if (window.fdc3) {
      broadcast(context)
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

const FxTrades = () => (
  <Subscribe fallback={<Loader ariaLabel="Loading trades blotter" />}>
    <ColFieldsContext.Provider value={fxColFields}>
      <ColDefContext.Provider value={fxColDef}>
        <TradesStreamContext.Provider value={trades$}>
          <SuspenseOnStaleData />
          <TradesStyle role="region" aria-labelledby="trades-table-heading">
            <TradesHeader section="blotter" />
            <TradesGrid caption="Reactive Trader FX Trades Table" />
            <TradesFooter />
          </TradesStyle>
        </TradesStreamContext.Provider>
      </ColDefContext.Provider>
    </ColFieldsContext.Provider>
  </Subscribe>
)

export default FxTrades
