import { Loader } from "components/Loader"
import styled from "styled-components/macro"

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`
const TradesWrapper = styled(Wrapper)`
  height: 100%;
`
export const Trades: React.FC = () => (
  <TradesWrapper>
    <Loader />
  </TradesWrapper>
)
