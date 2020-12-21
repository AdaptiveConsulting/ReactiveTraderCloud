import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import styled from "styled-components/macro"
import { Loader } from "components/Loader"
import { Tiles, tiles$ } from "./Tiles"
import { MainHeader, mainHeader$ } from "./MainHeader"

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  user-select: none;
`

const LiveRateWrapper = styled(Wrapper)`
  padding-right: 0;
  height: 100%;

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: auto;
`

const OverflowScroll = styled.div`
  overflow-y: scroll;
  height: 100%;
`

const liveRates$ = merge(tiles$, mainHeader$)

export const LiveRates: React.FC = () => (
  <LiveRateWrapper>
    <OverflowScroll>
      <div data-qa="workspace__tiles-workspace">
        <Subscribe
          source$={liveRates$}
          fallback={<Loader minWidth="22rem" minHeight="22rem" />}
        >
          <MainHeader />
          <Tiles />
        </Subscribe>
      </div>
    </OverflowScroll>
  </LiveRateWrapper>
)
