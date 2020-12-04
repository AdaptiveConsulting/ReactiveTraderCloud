import { Subscribe } from "@react-rxjs/core"
import { Loader } from "components/Loader"
import styled from "styled-components/macro"
import { Analytics as AnalyticsBase, analytics$ } from "./Analytics"

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
    <Subscribe
      source$={analytics$}
      fallback={<Loader minWidth="22rem" minHeight="22rem" />}
    >
      <AnalyticsBase />
    </Subscribe>
  </AnalyticsWrapper>
)
