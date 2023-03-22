import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import styled from "styled-components"

import { Loader } from "@/components/Loader"
import { registerCreditBlotterUpdates } from "@/notifications"
import { CreditTrade, creditTrades$ } from "@/services/trades"

import { ColDefContext, ColFieldsContext, TradesStreamContext } from "./Context"
import { TradesFooter } from "./TradesFooter"
import { TradesGridInner, TradesGridInnerProps } from "./TradesGrid/TradesGrid"
import { TradesHeader } from "./TradesHeader"
import { useCreditTradeRowHighlight } from "./TradesState"
import { creditColDef, creditColFields } from "./TradesState/colConfig"

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const TradesGrid = (props: TradesGridInnerProps<CreditTrade>) => {
  const highlightedRow = useCreditTradeRowHighlight()
  return <TradesGridInner highlightedRow={highlightedRow} {...props} />
}

const CreditTrades = () => {
  useEffect(() => {
    registerCreditBlotterUpdates()
  }, [])

  return (
    <Subscribe fallback={<Loader ariaLabel="Loading trades blotter" />}>
      <ColFieldsContext.Provider value={creditColFields}>
        <ColDefContext.Provider value={creditColDef}>
          <TradesStreamContext.Provider value={creditTrades$}>
            <TradesStyle role="region" aria-labelledby="trades-table-heading">
              <TradesHeader section="creditBlotter" />
              <TradesGrid caption="Reactive Trader Credit Trades Table" />
              <TradesFooter />
            </TradesStyle>
          </TradesStreamContext.Provider>
        </ColDefContext.Provider>
      </ColFieldsContext.Provider>
    </Subscribe>
  )
}

export default CreditTrades
