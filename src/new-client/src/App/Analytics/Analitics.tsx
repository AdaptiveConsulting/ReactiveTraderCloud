import { Loader } from 'components/Loader'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`
const AnalyticsWrapper = styled(Wrapper)`
  padding-left: 0;
  overflow: hidden;

  @media (max-width: 750px) {
    display: none;
  }
`
export const Analytics: React.FC = () => (
  <AnalyticsWrapper>
    <Loader minWidth="22rem" minHeight="22rem" />
  </AnalyticsWrapper>
)

