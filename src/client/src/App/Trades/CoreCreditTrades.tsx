import { Loader } from "@/components/Loader"
import { CreditTrade, creditTrades$ } from "@/services/trades"
import { Subscribe } from "@react-rxjs/core"
import styled from "styled-components"
import { ColDefContext, ColFieldsContext, Trades$Context } from "./Context"
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

const TradesGrid: React.FC<TradesGridInnerProps<CreditTrade>> = (props) => {
  const highlightedRow = useCreditTradeRowHighlight()
  return <TradesGridInner highlightedRow={highlightedRow} {...props} />
}

const CreditTrades: React.FC = () => {
  return (
    <Subscribe fallback={<Loader ariaLabel="Loading trades blotter" />}>
      <ColFieldsContext.Provider value={creditColFields}>
        <ColDefContext.Provider value={creditColDef}>
          <Trades$Context.Provider value={creditTrades$}>
            <TradesStyle role="region" aria-labelledby="trades-table-heading">
              <TradesHeader section="creditBlotter" />
              <TradesGrid caption="Reactive Trader Credit Trades Table" />
              <TradesFooter />
            </TradesStyle>
          </Trades$Context.Provider>
        </ColDefContext.Provider>
      </ColFieldsContext.Provider>
    </Subscribe>
  )
}

export default CreditTrades
