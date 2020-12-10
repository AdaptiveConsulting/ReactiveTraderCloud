import styled from "styled-components/macro"
import { Subscribe } from "@react-rxjs/core"
import { Loader } from "components/Loader"
import { trades$ } from "services/trades"
import { TradesGrid } from "./TradesGrid"
import { TradesFooter } from "./TradesFooter"
import { TradesHeader } from "./TradesHeader"

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`
const TradesWrapper = styled(Wrapper)`
  height: 100%;
`
const TradesStyle = styled("div")`
  height: 100%;
  width: 100%;
  min-height: 1.25rem;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`
export const Trades: React.FC = () => (
  <TradesWrapper>
    <Subscribe source$={trades$} fallback={<Loader />}>
      <TradesStyle>
        <TradesHeader />
        <TradesGrid />
        <TradesFooter />
      </TradesStyle>
    </Subscribe>
  </TradesWrapper>
)
