import styled from "styled-components/macro"
import { Subscribe } from "@react-rxjs/core"
import { Loader } from "components/Loader"
import { TradesGrid } from "./TradesGrid"
import { TradesFooter } from "./TradesFooter"
import { TradesHeader } from "./TradesHeader"
import { tableTrades$ } from "./TradesState"

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const Trades: React.FC = () => (
  <Subscribe source$={tableTrades$} fallback={<Loader />}>
    <TradesStyle>
      <TradesHeader />
      <TradesGrid />
      <TradesFooter />
    </TradesStyle>
  </Subscribe>
)

export default Trades
