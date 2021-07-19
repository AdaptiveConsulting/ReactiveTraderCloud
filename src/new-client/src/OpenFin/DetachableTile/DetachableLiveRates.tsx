import { Subscribe } from "@react-rxjs/core"
import styled from "styled-components"
import { MainHeader } from "@/App/LiveRates/MainHeader"
import { Loader } from "@/components/Loader"
import { DetachableTiles } from "./DetachableTiles"

const loader = (
  <Loader
    ariaLabel="Loading live FX exchange rates"
    minWidth="22rem"
    minHeight="22rem"
  />
)

export const DetachableLiveRates: React.FC = () => (
  <Subscribe fallback={loader}>
    <Wrapper>
      <MainHeader />
      <DetachableTiles />
    </Wrapper>
  </Subscribe>
)

const Wrapper = styled.div`
  padding: 0.5rem 0 0.5rem 1rem;
  user-select: none;
  height: 100%;
  background: ${({ theme }) => theme.core.darkBackground};

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: scroll;
`
