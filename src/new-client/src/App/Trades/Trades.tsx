import styled from "styled-components/macro"
import { Subscribe } from "@react-rxjs/core"
import { Loader } from "components/Loader"
import { trades$ } from "services/trades"
import { BlotterGrid } from "./BlotterGrid"
import { BlotterFooter } from "./BlotterFooter"
import { BlotterHeader } from "./BlotterHeader"

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`
const TradesWrapper = styled(Wrapper)`
  height: 100%;
`
const BlotterStyle = styled("div")`
  height: 100%;
  width: 100%;
  min-height: 1.25rem;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`
export const Trades: React.FC = () => (
  <TradesWrapper>
    <Subscribe source$={trades$} fallback={<Loader />}>
      <BlotterStyle>
        <BlotterHeader />
        <BlotterGrid />
        <BlotterFooter />
      </BlotterStyle>
    </Subscribe>
  </TradesWrapper>
)
